import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface CoffeeForm {
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
}

const API_URL = "http://127.0.0.1:8000";

const emptyForm: CoffeeForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  is_available: true,
};

function Dashboard() {
  const navigate = useNavigate();

  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add / Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<Coffee | null>(null);

  const [form, setForm] = useState<CoffeeForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --------------------------------------------------
  // Get token
  // --------------------------------------------------

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // --------------------------------------------------
  // Fetch coffees
  // --------------------------------------------------

  const fetchCoffees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/coffees/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch coffees");
      }

      const data: Coffee[] = await response.json();

      setCoffees(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load coffee menu");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial load
  // --------------------------------------------------

  useEffect(() => {
    fetchCoffees();
  }, []);

  // --------------------------------------------------
  // Open Add Modal
  // --------------------------------------------------

  const handleAddCoffee = () => {
    setEditingCoffee(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------

  const handleEditCoffee = (coffee: Coffee) => {
    setEditingCoffee(coffee);

    setForm({
      name: coffee.name,
      description: coffee.description,
      price: String(coffee.price),
      category: coffee.category,
      is_available: coffee.is_available,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // --------------------------------------------------
  // DELETE COFFEE
  // --------------------------------------------------

  const handleDeleteCoffee = async (coffee: Coffee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${coffee.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDeletingId(coffee.id);

      const response = await fetch(`${API_URL}/coffees/${coffee.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        navigate("/login");
        return;
      }

      // API error
      if (!response.ok) {
        let message = "Failed to delete coffee";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            message =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      // Success
      setSuccess(`"${coffee.name}" deleted successfully`);

      await fetchCoffees();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete coffee"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // Close Modal
  // --------------------------------------------------

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCoffee(null);
    setForm(emptyForm);
  };

  // --------------------------------------------------
  // Form change
  // --------------------------------------------------

  const handleChange = (
    field: keyof CoffeeForm,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // Save Coffee
  // --------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const price = Number(form.price);

    if (price <= 0 || Number.isNaN(price)) {
      setError("Please enter a valid price");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: price,
        category: form.category.trim(),
        is_available: form.is_available,
      };

      let response: Response;

      // EDIT
      if (editingCoffee) {
        response = await fetch(
          `${API_URL}/coffees/${editingCoffee.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      // ADD
      else {
        response = await fetch(`${API_URL}/coffees/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      // Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");

        navigate("/login");
        return;
      }

      // API Error
      if (!response.ok) {
        let message = "Something went wrong";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            message =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      // Success
      if (editingCoffee) {
        setSuccess("Coffee updated successfully");
      } else {
        setSuccess("Coffee added successfully");
      }

      setShowModal(false);
      setEditingCoffee(null);
      setForm(emptyForm);

      await fetchCoffees();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save coffee"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    navigate("/login");
  };

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalCoffees = coffees.length;

  const availableCoffees = coffees.filter(
    (coffee) => coffee.is_available
  ).length;

  const categories = new Set(
    coffees.map((coffee) => coffee.category.trim())
  ).size;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">
            ☕
          </div>

          <p className="text-gray-600">
            Loading CoffeeHub...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Dashboard
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-amber-700">
              CoffeeHub
            </h1>

            <p className="text-sm text-gray-500">
              Admin Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-amber-700"
            >
              View Website
            </button>

            <button
              onClick={handleLogout}
              className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-lg font-medium"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Heading */}

        <div className="mb-8">

          <p className="text-sm uppercase tracking-wider text-amber-700 font-medium">
            Admin Panel
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            Welcome to CoffeeHub ☕
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your coffee menu from here.
          </p>

        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && !showModal && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">

          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Total Coffees
            </p>

            <p className="text-3xl font-bold text-amber-700 mt-2">
              {totalCoffees}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Available Coffees
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {availableCoffees}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <p className="text-sm text-gray-500">
              Categories
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {categories}
            </p>
          </div>

        </div>

        {/* COFFEE TABLE */}

        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">

          {/* Table Header */}

          <div className="px-4 md:px-5 py-5 border-b flex items-center justify-between">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Coffee Menu
              </h3>

              <p className="text-sm text-gray-500">
                Current coffee items
              </p>
            </div>

            <button
              onClick={handleAddCoffee}
              className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-lg font-medium"
            >
              + Add Coffee
            </button>

          </div>

          {/* Table */}

          {coffees.length === 0 ? (

            <div className="py-12 text-center">

              <div className="text-5xl mb-4">
                ☕
              </div>

              <p className="text-gray-500">
                No coffee items found.
              </p>

              <button
                onClick={handleAddCoffee}
                className="mt-4 text-amber-700 font-medium hover:underline"
              >
                Add your first coffee
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="text-left px-4 py-4 text-sm font-medium text-gray-600">
                      Coffee
                    </th>

                    <th className="text-left px-4 py-4 text-sm font-medium text-gray-600">
                      Category
                    </th>

                    <th className="text-left px-4 py-4 text-sm font-medium text-gray-600">
                      Price
                    </th>

                    <th className="text-left px-4 py-4 text-sm font-medium text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-4 py-4 text-sm font-medium text-gray-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {coffees.map((coffee) => (

                    <tr
                      key={coffee.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* Coffee */}

                      <td className="px-4 py-5">

                        <p className="font-semibold text-slate-900">
                          {coffee.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {coffee.description}
                        </p>

                      </td>

                      {/* Category */}

                      <td className="px-4 py-5 text-gray-600">
                        {coffee.category}
                      </td>

                      {/* Price */}

                      <td className="px-4 py-5 font-medium text-amber-700">
                        ₹{coffee.price}
                      </td>

                      {/* Status */}

                      <td className="px-4 py-5">

                        {coffee.is_available ? (

                          <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            Available
                          </span>

                        ) : (

                          <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                            Unavailable
                          </span>

                        )}

                      </td>

                      {/* ACTION */}

                      <td className="px-4 py-5">

                        <div className="flex items-center gap-4">

                          {/* EDIT */}

                          <button
                            onClick={() =>
                              handleEditCoffee(coffee)
                            }
                            disabled={deletingId === coffee.id}
                            className="text-amber-700 hover:text-amber-900 font-medium disabled:opacity-50"
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDeleteCoffee(coffee)
                            }
                            disabled={deletingId === coffee.id}
                            className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                          >
                            {deletingId === coffee.id
                              ? "Deleting..."
                              : "Delete"}
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

      </main>

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="px-6 py-5 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingCoffee
                    ? "Edit Coffee"
                    : "Add Coffee"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingCoffee
                    ? "Update coffee details"
                    : "Add a new coffee to the menu"}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>

            </div>

            {/* Modal Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Modal Error */}

              {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>

              )}

              {/* Name */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coffee Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleChange(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Enter coffee name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />

              </div>

              {/* Description */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Enter coffee description"
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700 resize-none"
                />

              </div>

              {/* Price */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    handleChange(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder="Enter price"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />

              </div>

              {/* Category */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    handleChange(
                      "category",
                      event.target.value
                    )
                  }
                  placeholder="Example: Hot Coffee"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />

              </div>

              {/* Availability */}

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(event) =>
                    handleChange(
                      "is_available",
                      event.target.checked
                    )
                  }
                  className="w-4 h-4 accent-amber-700"
                />

                <span className="text-sm font-medium text-gray-700">
                  Coffee is available
                </span>

              </label>

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : editingCoffee
                    ? "Save Changes"
                    : "Add Coffee"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;