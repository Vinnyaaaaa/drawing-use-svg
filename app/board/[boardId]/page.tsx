import { Canvas } from "./_components/canvas";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

const BoardPage = ({ params }: BoardPageProps) => {
  return <Canvas id={params.boardId} />;
};
export default BoardPage;
