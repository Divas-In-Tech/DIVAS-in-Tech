import { Card } from "../components/ui/card";
import { Heart, Users, Target, HandHeart, TriangleAlert } from "lucide-react";

export type PendingUser = {
  firstName: string;
  lastName: string;
  accountType: string;
  eventAttended: string;
  createdAt: string;
};

type AdminDashboardProps = {
  pendingUsers?: PendingUser[];
};

export function AdminDashboard({
  pendingUsers = [{
    firstName: "Jane",
    lastName: "Doe",
    accountType: "Student",
    eventAttended: "Workshop 1",
    createdAt: "01/06/2024"
  },
  {
    firstName: "John",
    lastName: "Smith",
    accountType: "Student",
    eventAttended: "Workshop 2",
    createdAt: "04/16/2026"
  }],
}: AdminDashboardProps) {
  const warningThresholdMs = 14 * 24 * 60 * 60 * 1000; {/*14 days in milliseconds*/}

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[100px] overflow-hidden">
        <div className="absolute inset-0 bg-pink-700 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl mb-4">Admin Dashboard</h1>
          </div>
        </div>
      </section>

      {/* Pending Users Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Pending Users</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">First Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Account Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Attended</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pending Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingUsers.length > 0 ? (
                  pendingUsers.map((user) => {
                    const isOlderThan14Days = Date.now() - new Date(user.createdAt).getTime() > warningThresholdMs;

                    return (
                    <tr
                      key={`${user.firstName}-${user.lastName}-${user.createdAt}`}
                      className={isOlderThan14Days ? "bg-red-200 hover:bg-red-300" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{user.firstName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.accountType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.eventAttended}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          {isOlderThan14Days ? <TriangleAlert className="h-4 w-4 text-red-600" aria-label="Account pending for more than 14 days" /> : null}
                          <span>{user.createdAt}</span>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>
                      No pending users to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Account Search Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Account Search</h2>
          <p className="text-gray-600">
            Search and manage user accounts.
          </p>
        </div>
      </section>

      {/* Caldenar Management Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Calendar Management</h2>
          <p className="text-gray-600">
            Manage events and calendar entries.
          </p>
        </div>
      </section>
    </div>
  );
}
