import React from "react";
import { useDispatch } from "react-redux";
import { addStudentToBatch } from "../store/dataSlice";
import Button from "./Button";
import Card from "./Card";

const BatchCard = ({ batch, role }) => {
  const dispatch = useDispatch();

  if (role === "student") return null; // Students don't manage batches

  return (
    <Card className="mb-4">
      <h3 className="text-lg font-bold">{batch.name}</h3>
      <p className="text-gray-600 mb-4">{batch.description}</p>

      <div className="mt-4">
        <h4 className="font-medium mb-2">
          Students ({batch.students?.length || 0})
        </h4>
        <div className="max-h-32 overflow-y-auto">
          {batch.students?.map((student) => (
            <div key={student._id} className="text-sm text-gray-600">
              {student.name} ({student.email})
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => {
          const studentEmail = prompt("Add student email:");
          // Mock find student by email
          dispatch(addStudentToBatch({ batchId: batch.id, studentId: 3 })); // Example
        }}
      >
        Add Student
      </Button>
    </Card>
  );
};

export default BatchCard;


