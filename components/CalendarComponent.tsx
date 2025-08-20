import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CalendarComponentProps {
  date: Date;
  setDate: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  date,
  setDate,
}) => {
  return (
    <Card className="mx-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setDate(new Date(date.getTime() - 86400000))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {date.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              onChange={(value) => setDate(value as Date)}
              value={date}
              className="border-none"
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          onClick={() => setDate(new Date(date.getTime() + 86400000))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default CalendarComponent;
