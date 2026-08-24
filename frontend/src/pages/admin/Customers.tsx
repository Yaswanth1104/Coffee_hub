import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add / Edit form
  const [showForm, setShowForm] = useState(false);

  // null = Add mode
  // number = Edit mode
  const [editingCustomerId, setEditingCustomerId] =
    useState<number | null>(null);

  const [savingCustomer, setSavingCustomer] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
  });

  // ==========================================
  // GET CUSTOMERS
  // ==========================================

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

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleOpenAddForm = () => {
    setEditingCustomerId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setError("");
    setSuccessMessage("");

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomerId(customer.id);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
    });

    setError("");
    setSuccessMessage("");

    setShowForm(true);
  };

  // ==========================================
  // CANCEL FORM
  // ==========================================

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomerId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setError("");
  };

  // ==========================================
  // ADD / UPDATE CUSTOMER
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSavingCustomer(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      // --------------------------------------
      // ADD CUSTOMER
      // --------------------------------------

      if (editingCustomerId === null) {
        const response = await fetch(
          "http://127.0.0.1:8000/customers/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }),
          }
        );

        if (!response.ok) {
          let message = "Failed to add customer";

          try {
            const errorData = await response.json();

            if (errorData?.detail) {
              if (Array.isArray(errorData.detail)) {
                message = errorData.detail
                  .map(
                    (item: { msg?: string }) =>
                      item.msg
                  )
                  .join(", ");
              } else {
                message = errorData.detail;
              }
            }
          } catch {
            // Keep default error
          }

          throw new Error(message);
        }

        await response.json();

        setSuccessMessage(
          "Customer added successfully!"
        );
      }

      // --------------------------------------
      // UPDATE CUSTOMER
      // --------------------------------------

      else {
        const response = await fetch(
          `http://127.0.0.1:8000/customers/${editingCustomerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }),
          }
        );

        if (!response.ok) {
          let message = "Failed to update customer";

          try {
            const errorData = await response.json();

            if (errorData?.detail) {
              if (Array.isArray(errorData.detail)) {
                message = errorData.detail
                  .map(
                    (item: { msg?: string }) =>
                      item.msg
                  )
                  .join(", ");
              } else {
                message = errorData.detail;
              }
            }
          } catch {
            // Keep default error
          }

          throw new Error(message);
        }

        await response.json();

        setSuccessMessage(
          "Customer updated successfully!"
        );
      }

      // --------------------------------------
      // RESET FORM
      // --------------------------------------

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      setShowForm(false);
      setEditingCustomerId(null);

      // --------------------------------------
      // REFRESH CUSTOMER LIST
      // --------------------------------------

      await fetchCustomers();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSavingCustomer(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================
          HEADER
      ======================================= */}

      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5">

          <h1 className="text-2xl font-bold text-amber-900">
            Customer Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage CoffeeHub customers
          </p>

        </div>
      </header>

      {/* ======================================
          MAIN
      ======================================= */}

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ====================================
            SUCCESS MESSAGE
        ===================================== */}

        {successMessage && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* ====================================
            GENERAL ERROR
        ===================================== */}

        {error && !showForm && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg">

            <p className="mb-3">
              {error}
            </p>

            <button
              onClick={fetchCustomers}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ====================================
            ADD / EDIT FORM
        ===================================== */}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">

            {/* Form Header */}

            <div className="px-6 py-5 border-b">

              <h2 className="text-xl font-semibold text-gray-800">
                {editingCustomerId === null
                  ? "Add Customer"
                  : "Edit Customer"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingCustomerId === null
                  ? "Enter customer details below"
                  : "Update customer details below"}
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              {/* Form Error */}

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter customer email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={handleCancelForm}
                  disabled={savingCustomer}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingCustomer}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50"
                >
                  {savingCustomer
                    ? editingCustomerId === null
                      ? "Adding..."
                      : "Updating..."
                    : editingCustomerId === null
                    ? "Add Customer"
                    : "Update Customer"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">

            <p className="text-gray-500">
              Loading customers...
            </p>

          </div>
        )}

        {/* ====================================
            CUSTOMER TABLE
        ===================================== */}

        {!loading && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* Table Header */}

            <div className="px-6 py-5 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Customers
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {customers.length} customer
                  {customers.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              {/* Add Customer */}

              {!showForm && (
                <button
                  onClick={handleOpenAddForm}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg font-medium"
                >
                  + Add Customer
                </button>
              )}

            </div>

            {/* ==================================
                NO CUSTOMERS
            =================================== */}

            {customers.length === 0 ? (
              <div className="p-10 text-center">

                <p className="text-gray-500 mb-5">
                  No customers found.
                </p>

                {!showForm && (
                  <button
                    onClick={handleOpenAddForm}
                    className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg"
                  >
                    + Add First Customer
                  </button>
                )}

              </div>
            ) : (

              /* ==================================
                 CUSTOMER TABLE
              =================================== */

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

                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                        Action
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

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              handleEditCustomer(
                                customer
                              )
                            }
                            className="text-amber-800 hover:text-amber-950 font-medium"
                          >
                            Edit
                          </button>

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