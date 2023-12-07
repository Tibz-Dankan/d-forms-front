import React, { Fragment } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

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
      <div>
        <ProgressBar
          completed={completed}
          className="rounded border-[1px]  border-gray-300"
          barContainerClassName="container"
          completedClassName={`bg-primary ${completedWidth} transition-all `}
          labelClassName="label"
        />
      </div>
    </Fragment>
  );
};
