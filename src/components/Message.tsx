import { Label } from "@/components/ui/label";

type MessageSettings = {
  title: string;
  message: string;
};

export default function MessageBox({ title, message }: MessageSettings) {
  return (
    <div
      className="mb-4 rounded-lg bg-blue-50 px-6 py-5 text-base border border-gray-300"
    >
      <h4 className="mb-2 text-lg font-medium leading-tight">
        <span>
          {title}{" "}
        </span>
      </h4>
      <div>
        <div className="flex text-lg items-center space-x-2">
          {message}
        </div>
      </div>
    </div>
  );
}
