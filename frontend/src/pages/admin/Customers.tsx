import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://127.0.0.1:8000/customers/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.detail) {
          throw new Error(
            typeof errorData.detail === "string"
              ? errorData.detail
              : "Failed to fetch customers"
          );
        }

        throw new Error("Failed to fetch customers");
      }

      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">
              Customer Management
            </h1>
            <p className="text-gray-500 mt-1">
              View CoffeeHub customers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium"
            >
              ← Dashboard
            </button>

            <button
              onClick={() => navigate("/")}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium"
            >
              View Website
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm mb-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCustomers}
              className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Customers
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {customers.length} customer
                {customers.length !== 1 ? "s" : ""}
              </p>
            </div>

            {customers.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-500">No customers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                        Phone
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {customer.phone || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Customers;
