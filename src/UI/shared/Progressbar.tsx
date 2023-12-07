import React, { Fragment } from "react";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { Progress } from "@material-tailwind/react";

interface ProgressbarProps {
  completed: number;
}

export const Progressbar: React.FC<ProgressbarProps> = (props) => {
  const completed: number = props.completed ? props.completed : 0;
  const completedWidth: string = !!props.completed
    ? `w-[${props.completed}%]`
    : "w-[0%]";

  return (
    <Fragment>
      <div className="w-full bg-green-500">
        <span>Progressbar</span>
        {/* <ProgressBar
          completed={completed}
          className="rounded border-[1px]  border-gray-300"
          barContainerClassName="container"
          completedClassName={`bg-primary ${completedWidth} transition-all `}
          labelClassName="label"
        /> */}
        {/* <progress value={0.5} className="bg-primary" /> */}
        <progress value={0.5} style={{ backgroundColor: "#3490dc" }} />
        {/* <Progress
          value={completed}
          color="blue"
          size="sm"
          className="bg-primary"
        /> */}
      </div>
    </Fragment>
  );
};
