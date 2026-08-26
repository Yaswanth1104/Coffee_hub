import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  password: string;
}

const emptyForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  password: "",
};

const API_URL = "http://127.0.0.1:8000";

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);

  const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Authentication required");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const readError = async (response: Response) => {
    const body = await response.json().catch(() => null);
    return typeof body?.detail === "string" ? body.detail : "Request failed";
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/customers/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(await readError(response));
      setCustomers(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCreate = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      pincode: customer.pincode || "",
      password: "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingCustomer(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        pincode: form.pincode.trim() || null,
        ...(form.password.trim() ? { password: form.password } : {}),
      };

      const url = editingCustomer
        ? `${API_URL}/customers/${editingCustomer.id}`
        : `${API_URL}/customers/`;
      const method = editingCustomer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await readError(response));

      setSuccess(editingCustomer ? "Customer updated successfully" : "Customer created successfully");
      closeForm();
      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save customer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete ${customer.name}? This will also remove their customer account.`
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${API_URL}/customers/${customer.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(await readError(response));
      setSuccess("Customer deleted successfully");
      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete customer");
    }
  };

  const updateField = (field: keyof CustomerForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Customer Management</h1>
            <p className="text-gray-500 mt-1">Create, update and manage CoffeeHub customers</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium">← Dashboard</button>
            <button onClick={() => navigate("/")} className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium">View Website</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-5">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-5">{success}</div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
                <p className="text-gray-500 mt-1">{editingCustomer ? "Update customer information" : "Create a customer account"}</p>
              </div>
              <button type="button" onClick={closeForm} className="text-gray-500 hover:text-gray-900 text-2xl">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                ["name", "Name", "text", true],
                ["email", "Email", "email", true],
                ["phone", "Phone", "text", false],
                ["address", "Address", "text", false],
                ["city", "City", "text", false],
                ["pincode", "Pincode", "text", false],
                ["password", editingCustomer ? "New Password (optional)" : "Password", "password", !editingCustomer],
              ] as const).map(([field, label, type, required]) => (
                <label key={field} className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
                  <input
                    type={type}
                    required={required}
                    value={form[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={closeForm} className="border border-gray-300 px-5 py-2.5 rounded-lg">Cancel</button>
              <button disabled={saving} type="submit" className="bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium">
                {saving ? "Saving..." : editingCustomer ? "Update Customer" : "Create Customer"}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
              <p className="text-sm text-gray-500 mt-1">{customers.length} customer{customers.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={openCreate} className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-lg font-medium">+ Add Customer</button>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Phone</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-gray-600">{customer.phone || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEdit(customer)} className="text-amber-800 hover:text-amber-950 font-medium mr-4">Edit</button>
                        <button onClick={() => handleDelete(customer)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Customers;
