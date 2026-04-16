import { useState } from "react";
import { Card } from "../components/ui/card";
import { Crown, Search, TriangleAlert, UserX} from "lucide-react";

{/* TODO: Most of this right below here is prop data used to test. Doesn't
  guarantee future data appearance-- must be changed to match
  actual database structure*/}

export type PendingUser = {
  firstName: string;
  lastName: string;
  accountType: string;
  eventAttended: string;
  createdAt: string;
};

export type SearchableUser = {
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  status: string;
  joinedAt: string;
};

type AdminDashboardProps = {
  pendingUsers?: PendingUser[];
  searchableUsers?: SearchableUser[];
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
  searchableUsers = [
    {
      firstName: "Janie",
      lastName: "Doe",
      email: "janie.doe@divasintech.org",
      accountType: "Student",
      status: "Active",
      joinedAt: "01/06/2024",
    },
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@divasintech.org",
      accountType: "Student",
      status: "Pending",
      joinedAt: "04/16/2026",
    },
  ],
}: AdminDashboardProps) {
  const warningThresholdMs = 14 * 24 * 60 * 60 * 1000; {/*14 days in milliseconds*/}
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof searchableUsers)[number] | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    setSearchAttempted(true);

    if (!normalizedQuery) {
      setSelectedUser(null);
      return;
    }

    const matchedUser = searchableUsers.find((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery);
    });

    setSelectedUser(matchedUser ?? null);
  };

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
                    const isOlderThan14Days = Date.now() - new Date(user.createdAt).getTime() >= warningThresholdMs;

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
          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <label className="sr-only" htmlFor="account-search">
                Search for a user by name or email
              </label>
              <input
                id="account-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search by name or email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {selectedUser ? (
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p>{selectedUser.email}</p>
                    <p>Account Type: {selectedUser.accountType}</p>
                    <p>Status: {selectedUser.status}</p>
                    <p>Joined: {selectedUser.joinedAt}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      aria-label={`Promote ${selectedUser.firstName} ${selectedUser.lastName} to admin`}
                      className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      <Crown className="h-4 w-4" />
                      Promote to Admin
                    </button>
                    <button
                      type="button"
                      aria-label={`Deactivate ${selectedUser.firstName} ${selectedUser.lastName} account`}
                      className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      <UserX className="h-4 w-4" />
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            ) : searchAttempted ? (
              <p className="mt-4 text-sm text-gray-500">
                No account matched that name or email.
              </p>
            ) : null}
          </Card>
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
