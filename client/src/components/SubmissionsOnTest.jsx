import React from "react";
import { useNavigate } from "react-router-dom";

const SubmissionsOnTest = ({ selectedTest, submissions }) => {
  const navigate = useNavigate();

  if (!selectedTest) {
    return (
      <section className="lg:col-span-3">
        <div className="bg-tertiary p-6 rounded-2xl shadow-xl flex items-center justify-center h-full">
          <p className="text-senary text-lg">Select a test to view submissions</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-3">
      <div className="bg-tertiary p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-teal mb-6">
          Submissions for {selectedTest.title}
        </h2>
        {submissions.length === 0 ? (
          <p className="text-senary text-center py-10">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-quaternary text-septenary">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-quaternary">
                {submissions.map((sub) => (
                  <tr
                    key={sub._id}
                    className="hover:bg-quinary transition-colors duration-200"
                  >
                    <td className="p-4 text-octonary">{sub.student.email}</td>
                    <td className="p-4">
                      <span
                        className={
                          sub.answers.some((ans) => ans.marks > 0) ? "text-teal" : "text-yellow"
                        }
                      >
                        {sub.answers.some((ans) => ans.marks > 0) ? "Evaluated" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/teacher/evaluate/${sub._id}`)}
                        className="px-4 py-2 bg-teal text-background rounded-lg hover:bg-hover-teal transition-colors duration-300 font-semibold"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubmissionsOnTest;