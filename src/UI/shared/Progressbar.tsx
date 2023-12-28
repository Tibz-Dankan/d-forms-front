import React, { Fragment } from "react";
import { Progress } from "@material-tailwind/react";

interface ProgressbarProps {
  completed: number;
}

export const Progressbar: React.FC<ProgressbarProps> = (props) => {
  const completed: number = props.completed ? props.completed : 0;
  // const completedWidth: string = !!props.completed
  //   ? `w-[${props.completed}%]`
  //   : "w-[0%]";

  return (
    <Fragment>
      <div className="w-full">
        <Progress
          value={completed}
          color="pink"
          size="sm"
          className="border-[1px] border-gray-300 fill-primary"
        />
      </div>
    </Fragment>
  );
};
