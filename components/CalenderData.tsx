"use client";

import React from "react"; // , { useState }
import { Calendar } from "./ui/Calender";

interface CalenderProps {
  onDateChange: (date: Date | undefined) => void;
}

const CalenderData: React.FC<CalenderProps> = ({ onDateChange }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      className="rounded-md border bg-white"
    />
  );
};

export default CalenderData;
