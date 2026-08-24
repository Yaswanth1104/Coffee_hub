import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [form, setForm] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
  });

  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH CUSTOMERS
  // =========================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "http://127.0.0.1:8000/customers/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data: Customer[] = await response.json();

      setCustomers(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
    });

    setError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setError("");
  };

  // =========================
  // FORM INPUT CHANGE
  // =========================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  // =========================
  // ADD / UPDATE CUSTOMER
  // =========================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const url = editingCustomer
        ? `http://127.0.0.1:8000/customers/${editingCustomer.id}`
        : "http://127.0.0.1:8000/customers/";

      const method = editingCustomer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.detail) {
          throw new Error(
            typeof errorData.detail === "string"
              ? errorData.detail
              : "Failed to save customer"
          );
        }

        throw new Error("Failed to save customer");
      }

      if (editingCustomer) {
        setSuccessMessage(
          "Customer updated successfully!"
        );
      } else {
        setSuccessMessage(
          "Customer added successfully!"
        );
      }

      closeForm();

      await fetchCustomers();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE CUSTOMER
  // =========================

  const deleteCustomer = async (
    customerId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/customers/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) => customer.id !== customerId
        )
      );

      setSuccessMessage(
        "Customer deleted successfully!"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =========================
          HEADER
      ========================= */}

      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-amber-900">
              Customer Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage CoffeeHub customers
            </p>
          </div>

          {/* =========================
              NAVIGATION BUTTONS
          ========================= */}

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

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-5 mb-6">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && !showForm && (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm mb-6">

            <p className="text-red-600 mb-4">
              {error}
            </p>

            <button
              onClick={fetchCustomers}
              className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg"
            >
              Try Again
            </button>

          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              Loading customers...
            </p>
          </div>
        )}

        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingCustomer
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingCustomer
                    ? "Update customer information"
                    : "Enter customer information"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM ERROR */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* NAME */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter customer name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter customer email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCustomer
                    ? "Update Customer"
                    : "Add Customer"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =========================
            CUSTOMER TABLE
        ========================= */}

        {!loading && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* TABLE HEADER */}

            <div className="px-6 py-5 border-b flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Customers
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {customers.length} customer
                  {customers.length !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={openAddForm}
                className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg font-medium"
              >
                + Add Customer
              </button>

            </div>

            {/* EMPTY STATE */}

            {customers.length === 0 ? (

              <div className="p-10 text-center">

                <p className="text-gray-500">
                  No customers found.
                </p>

                <button
                  onClick={openAddForm}
                  className="mt-4 bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg"
                >
                  Add First Customer
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  {/* TABLE HEAD */}

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

                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                        Action
                      </th>

                    </tr>

                  </thead>

                  {/* TABLE BODY */}

                  <tbody>

                    {customers.map((customer) => (

                      <tr
                        key={customer.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >

                        {/* NAME */}

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {customer.name}
                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4 text-gray-600">
                          {customer.email}
                        </td>

                        {/* PHONE */}

                        <td className="px-6 py-4 text-gray-600">
                          {customer.phone || "-"}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-4">

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                openEditForm(customer)
                              }
                              className="text-amber-800 hover:text-amber-950 font-medium"
                            >
                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() =>
                                deleteCustomer(customer.id)
                              }
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>

                          </div>

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