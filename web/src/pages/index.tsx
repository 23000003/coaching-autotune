import { Link } from "react-router";


const Index = () => {
  return (
    <div className="h-svh flex flex-col items-center gap-10">
      <span>
        Landing
      </span>
      <Link to="/studio/1" className="p-5 border-white border">
        to studio #1
      </Link>
    </div>
  )
};

export default Index;