import WelcomePage from "../components/WelcomePage";

interface IndexProps {
  onSetPath: (path: string) => void;
}

const Index = ({ onSetPath }: IndexProps) => {
  return <WelcomePage onSetPath={onSetPath} />;
};

export default Index;
