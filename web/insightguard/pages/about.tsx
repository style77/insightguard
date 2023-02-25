import styled from 'styled-components';

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  background: linear-gradient(to right, #444444, #222222);
  opacity: 0.9;
  background-size: cover;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const Heading = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  text-shadow: 2px 2px 0 #666, 3px 3px 0 #555, 4px 4px 0 #444, 5px 5px 0 #333;
  letter-spacing: 2px;
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 24px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  text-align: justify;
  padding: 0 16px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 24px;
`;

const FeatureListItem = styled.li`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 8px;
  color: #fff;
  font-family: 'Inter', sans-serif;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

export default function About() {
  return (
    <AboutContainer>
      <ContentWrapper>
        <Heading>About InsightGuard</Heading>
        <Text>
          InsightGuard is an AI-powered cyberbullying detection API that helps identify and flag harmful online behavior. With the rise of social media, online bullying has become a serious problem, affecting millions of people worldwide. Our mission is to make the internet a safer and more inclusive space by providing a powerful tool for individuals and organizations to protect themselves and their communities.
        </Text>
        <FeatureList>
          <FeatureListItem><BoldText>Advanced machine learning algorithms</BoldText> - Our state-of-the-art algorithms can analyze vast amounts of data and accurately detect instances of cyberbullying and other harmful behavior.</FeatureListItem>
          <FeatureListItem><BoldText>Real-time monitoring and alerts</BoldText> - Our API can be integrated with existing platforms to provide real-time monitoring and automatic alerts when harmful behavior is detected.</FeatureListItem>
          <FeatureListItem><BoldText>User-friendly interface</BoldText> - Our dashboard makes it easy to view and analyze data, track trends, and take action to prevent cyberbullying and other types of online harm.</FeatureListItem>
        </FeatureList>
        <Text>
          Whether you're an individual looking to protect yourself and your loved ones, or an organization looking to promote a safe and inclusive online environment, InsightGuard has the tools and expertise to help you achieve your goals. Contact us today to learn more and get started!
        </Text>
      </ContentWrapper>
    </AboutContainer>
  );
}
