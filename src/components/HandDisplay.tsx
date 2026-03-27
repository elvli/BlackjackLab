import { Card } from "@/components/utils/cardUtils";
import CardFan from "@/components/table/CardFan";

interface HandDisplayProps {
  hand: Card[];
  hiddenCardIndices?: number[];
}

const HandDisplay: React.FC<HandDisplayProps> = ({
  hand,
  hiddenCardIndices = [],
}) => {
  return <CardFan hand={hand} hiddenCardIndices={hiddenCardIndices} />;
};

export default HandDisplay;
