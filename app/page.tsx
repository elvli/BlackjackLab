import Navbar from "./components/Navbar";
import GameTable from "./components/GameTable";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <GameTable />
    </div>
  );
}
