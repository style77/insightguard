import os
from datetime import datetime
from typing import Union, List, Tuple, Set, Dict, Any

import nltk as nltk
import pandas as pd
import tensorflow as tf
from keras.preprocessing.text import Tokenizer
from keras.utils import pad_sequences
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification

from threading import Lock, Thread
import numpy as np
from datasets import load_dataset

import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

data = load_dataset("Mitake/PhishingURLsANDBenignURLs")


class SingletonMeta(type):
    """
    This is a thread-safe implementation of Singleton.
    https://refactoring.guru/design-patterns/singleton/python/example#example-1
    """

    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
        return cls._instances[cls]


class SingletonMetaWithLang(type):
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
    "pl": "idiota",
    "jp": "クソゴミ",
    "sp": "maldita basura",
    "ca": "putes escombraries",
    "en": "fucking idiot",
}


class BullyingScanner(metaclass=SingletonMetaWithLang):
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
            return 0 if vals[0] > vals[1] else 1
        else:
            return 0

    def load_model(self, from_pt: bool):
        """
          Loads BERT from pretrained bullying
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

        return probabilities.numpy()[0][await self.find_bullying_index()]


class PhishingURLClassifier(metaclass=SingletonMeta):
    def __init__(self, model_path: str = 'models/phishing.h5'):
        self.model = tf.keras.models.load_model(model_path)

    @staticmethod
    def normalize(values):
        """Refactor values to dict"""
        urls = values[1]
        values = [val[1] for val in np.ndarray.tolist(values[0])]
        now = datetime.now()
        return [
            {'url': url, 'prediction': value, 'created_at': now}
            for url, value in zip(urls, values)
        ]

    def predict(self, urls: Set[str], normalize: bool = True):
        """
        Predict phishing urls

        Args:
            urls (Set[str]): Set of urls to predict
            normalize (bool): If True, return dict with urls as keys and values as values
        Returns:
            Tuple[Set[str], List[float]]: Tuple of urls and values
        """
        tokenizer = Tokenizer(num_words=10000)
        tokenizer.fit_on_texts(data['train']['url'])

        urls_sequenced = tokenizer.texts_to_sequences(urls)
        urls_sequenced = pad_sequences(urls_sequenced, maxlen=100)
        values = (self.model.predict(urls_sequenced), urls)
        if normalize:
            values = self.normalize(values)
        return values


nltk.download('stopwords')
nltk.download('punkt')
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

email_data = pd.read_csv('./insightguard/services/insightguard/datasets/fraud_email_.csv')


class PhishingEmailClassifier(metaclass=SingletonMeta):
    def __init__(self, model_path: str = 'models/phishing-email.h5'):
        self.model = tf.keras.models.load_model(model_path)

        self.tokenizer = Tokenizer(num_words=10000)

        preprocessed_text = email_data['Text'].apply(self.preprocess_text)


    def preprocess_text(self, text):
        if isinstance(text, str):
            tokens = nltk.word_tokenize(text)
            tokens = [word for word in tokens if word.lower() not in stop_words]
            tokens = [stemmer.stem(word) for word in tokens]
            return ' '.join(tokens)
        else:
            return ''

    def predict(self, content: str) -> float:
        """
        Predict phishing urls

        Args:
            content (str): Content of email to predict
        Returns:
            float: Value of prediction
        """
        content = self.preprocess_text(content)

        self.tokenizer.fit_on_texts([content])

        input_sequence = self.tokenizer.texts_to_sequences([content])
        input_data = pad_sequences(input_sequence, maxlen=100)

        return self.model.predict(input_data)[0][0]
