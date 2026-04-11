import { Ban, Check, CircleAlert, CircleCheck, CircleX, OctagonAlert } from "lucide-react";


export const Toast = ({
  message,
  type,
}: {
  message: String;
  type: "success" | "error" | "warning" | "informational";
}) => {

    const backgounds = `
    ${type === "success" && 'bg-[#ECFDF3] border-[#039855]'}
    ${type === "error" && 'bg-[#FEF3F2] border-[#F04438]'}
    ${type === "warning" && 'bg-[#FFFAEB] border-[#F79009]'}
    ${type === "informational" && 'bg-[#EFF8FF] border-[#1570EF]'}
    `
  
  return (
    <div className={`${backgounds} border-2 self-start px-5 py-2 rounded-4xl flex items-center max-w-96 gap-3`}>
      {type === "success" && (
        <div className="bg-[#039855] rounded-full p-1">
          <CircleCheck strokeWidth={3} size={15} color="white"/>
        </div>
      )}

      {type === "error" && (
        <div className="bg-red-500 rounded-full p-1">
          <CircleX strokeWidth={3} size={15} color={"#fff"}  />
        </div>
      )}

      {type === "warning" && (
        <div className="bg-yellow-500 rounded-full p-1">
          <OctagonAlert strokeWidth={3} size={15} color={"#fff"} />
        </div>
      )}

      {type === "informational" && (
        <div className="bg-[#1570EF] rounded-full p-1">
          <CircleAlert strokeWidth={3} size={15} color={"#fff"} />
        </div>
      )}

      <p className="text-[#203751] font-bold text-sm">{message}</p>
    </div>
  );
};
