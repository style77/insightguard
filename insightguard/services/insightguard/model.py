from typing import Union, List

import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification

from threading import Lock, Thread


class SingletonMeta(type):
    """
    This is a thread-safe implementation of Singleton, with addition to store instances
    with different languages.
    https://refactoring.guru/design-patterns/singleton/python/example#example-1
    """

    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, lang: str, *args, **kwargs):
        with cls._lock:
            if lang not in cls._instances:
                instance = super().__call__(lang, *args, **kwargs)
                cls._instances[lang] = instance
        return cls._instances[lang]


model_map = {
    "pl": "ptaszynski/bert-base-polish-cyberbullying",
    "jp": "kit-nlp/bert-base-japanese-basic-char-v2-cyberbullying",
    "sp": "JonatanGk/roberta-base-bne-finetuned-cyberbullying-spanish",
    "ca": "JonatanGk/roberta-base-ca-finetuned-cyberbullying-catalan",
    "en": "socialmediaie/TRAC2020_ENG_B_bert-base-uncased",
}

# These are words that will for sure return positive value for scanner
# they are used to set bullying_index on set up
curse_words = {
    "pl": "kurwo",
    "jp": "クソゴミ",
    "sp": "maldita basura",
    "ca": "putes escombraries",
    "en": "fucking trash",
}


class BullyingScanner(metaclass=SingletonMeta):
    def __init__(self, lang: str):
        self.lang = lang
        self.tokenizer = None
        self.model = None
        self.load_model(from_pt=True)

    async def find_bullying_index(self) -> int:
        """
        Find index that reference to 'bullying' value of prediction

        Returns:
            int: Index of 'bulling' value
        """
        sentence = curse_words[self.lang]
        vals = await self.predict(sentence, both=True)

        if len(vals) == 2:
            i = 0 if vals[0] > vals[1] else 1
        else:
            i = 0

        return i

    def load_model(self, from_pt: bool):
        """
          Loads BERT from pretrained model
        """
        self.model = TFAutoModelForSequenceClassification.from_pretrained(
            model_map[self.lang], from_pt=from_pt)

    async def predict(self, text: str, both: bool = False) -> Union[float, List[float]]:
        """
        Predict the probability of the input text being a cyberbullying message.

        Args:
            text (str): The text to be classified.
            both (bool): Return one value from model or both
            from_pt (bool): Load model from pytorch

        Returns:
            Union[float, List[float]]: The probability of the text being a cyberbullying message.
        """
        if self.tokenizer is None:
            self.tokenizer = AutoTokenizer.from_pretrained(model_map[self.lang])

        if self.model is None:
            self.load_model(from_pt=True)

        encoded_input = self.tokenizer.encode_plus(text, padding=True, truncation=True,
                                                   max_length=2048, return_tensors='tf')

        with tf.device('/CPU:0'), tf.GradientTape() as tape:
            output = self.model(encoded_input)
            logits = output.logits

        probabilities = tf.nn.softmax(logits)

        if both:
            return probabilities[0].numpy().tolist()

        predicted_value = probabilities.numpy()[0][await self.find_bullying_index()]

        return predicted_value
