import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
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

function CoffeeManagement() {
  const navigate = useNavigate();

  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCoffee, setEditingCoffee] =
    useState<Coffee | null>(null);

  const [form, setForm] =
    useState<CoffeeForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // =========================================
  // TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // =========================================
  // HANDLE UNAUTHORIZED
  // =========================================

  const handleUnauthorized = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    navigate("/login", { replace: true });
  };

  // =========================================
  // FETCH COFFEES
  // =========================================

  const fetchCoffees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(
        `${API_URL}/coffees/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch coffee menu"
        );
      }

      const data: Coffee[] =
        await response.json();

      setCoffees(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load coffee menu"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    fetchCoffees();
  }, []);

  // =========================================
  // OPEN ADD MODAL
  // =========================================

  const handleAddCoffee = () => {
    setEditingCoffee(null);
    setForm(emptyForm);

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =========================================
  // OPEN EDIT MODAL
  // =========================================

  const handleEditCoffee = (
    coffee: Coffee
  ) => {
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

  // =========================================
  // DELETE COFFEE
  // =========================================

  const handleDeleteCoffee = async (
    coffee: Coffee
  ) => {
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
      navigate("/login", { replace: true });
      return;
    }

    try {
      setDeletingId(coffee.id);

      const response = await fetch(
        `${API_URL}/coffees/${coffee.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let message =
          "Failed to delete coffee";

        try {
          const errorData =
            await response.json();

          if (errorData.detail) {
            message =
              typeof errorData.detail ===
              "string"
                ? errorData.detail
                : JSON.stringify(
                    errorData.detail
                  );
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      setSuccess(
        `"${coffee.name}" deleted successfully`
      );

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

  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingCoffee(null);
    setForm(emptyForm);
  };

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (
    field: keyof CoffeeForm,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================================
  // ADD / UPDATE COFFEE
  // =========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const name = form.name.trim();
    const description =
      form.description.trim();
    const category =
      form.category.trim();

    const price = Number(form.price);

    // Validation

    if (!name) {
      setError("Coffee name is required");
      return;
    }

    if (!description) {
      setError(
        "Coffee description is required"
      );
      return;
    }

    if (!category) {
      setError(
        "Coffee category is required"
      );
      return;
    }

    if (
      Number.isNaN(price) ||
      price <= 0
    ) {
      setError(
        "Please enter a valid price"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        description,
        price,
        category,
        is_available:
          form.is_available,
      };

      let response: Response;

      // =====================================
      // UPDATE
      // =====================================

      if (editingCoffee) {
        response = await fetch(
          `${API_URL}/coffees/${editingCoffee.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      // =====================================
      // ADD
      // =====================================

      else {
        response = await fetch(
          `${API_URL}/coffees/`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      // =====================================
      // UNAUTHORIZED
      // =====================================

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // =====================================
      // API ERROR
      // =====================================

      if (!response.ok) {
        let message =
          "Something went wrong";

        try {
          const errorData =
            await response.json();

          if (errorData.detail) {
            message =
              typeof errorData.detail ===
              "string"
                ? errorData.detail
                : JSON.stringify(
                    errorData.detail
                  );
          }
        } catch {
          // Ignore parsing error
        }

        throw new Error(message);
      }

      // =====================================
      // SUCCESS
      // =====================================

      if (editingCoffee) {
        setSuccess(
          "Coffee updated successfully"
        );
      } else {
        setSuccess(
          "Coffee added successfully"
        );
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

  // =========================================
  // STATISTICS
  // =========================================

  const totalCoffees =
    coffees.length;

  const availableCoffees =
    coffees.filter(
      (coffee) =>
        coffee.is_available
    ).length;

  const categories =
    new Set(
      coffees.map(
        (coffee) =>
          coffee.category.trim()
      )
    ).size;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="text-center">

          <div className="text-6xl mb-4 animate-pulse">
            ☕
          </div>

          <p className="text-gray-600">
            Loading coffee menu...
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold text-amber-900">
              Coffee Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage CoffeeHub coffee menu
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              ← Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/")
              }
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              View Website
            </button>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && !showModal && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Total Coffees
            </p>

            <p className="text-3xl font-bold text-amber-700 mt-2">
              {totalCoffees}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Available Coffees
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {availableCoffees}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Categories
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {categories}
            </p>

          </div>

        </div>

        {/* COFFEE TABLE */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Coffee Menu
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {coffees.length} coffee
                {coffees.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            <button
              onClick={handleAddCoffee}
              className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg font-medium"
            >
              + Add Coffee
            </button>

          </div>

          {coffees.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                ☕
              </div>

              <p className="text-gray-500">
                No coffee items found.
              </p>

              <button
                onClick={handleAddCoffee}
                className="mt-4 text-amber-800 hover:text-amber-950 font-medium"
              >
                Add your first coffee
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                      Coffee
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                      Category
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                      Price
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {coffees.map(
                    (coffee) => (

                      <tr
                        key={coffee.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >

                        {/* NAME */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-800">
                            {coffee.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {coffee.description}
                          </p>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-5 text-gray-600">
                          {coffee.category}
                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5 font-semibold text-amber-700">
                          ₹{coffee.price}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          {coffee.is_available ? (

                            <span className="inline-flex px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                              Available
                            </span>

                          ) : (

                            <span className="inline-flex px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                              Unavailable
                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          <div className="flex gap-3">

                            <button
                              onClick={() =>
                                handleEditCoffee(
                                  coffee
                                )
                              }
                              className="text-amber-800 hover:text-amber-950 font-medium"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteCoffee(
                                  coffee
                                )
                              }
                              disabled={
                                deletingId ===
                                coffee.id
                              }
                              className="text-red-600 hover:text-red-800 font-medium disabled:text-gray-400"
                            >
                              {deletingId ===
                              coffee.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
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
                onClick={closeModal}
                disabled={saving}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* NAME */}

              <div>

                <label className="block text-gray-700 font-medium mb-2">
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

              {/* DESCRIPTION */}

              <div>

                <label className="block text-gray-700 font-medium mb-2">
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />

              </div>

              {/* PRICE + CATEGORY */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-gray-700 font-medium mb-2">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
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

                <div>

                  <label className="block text-gray-700 font-medium mb-2">
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
                    placeholder="e.g. Hot Coffee"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />

                </div>

              </div>

              {/* AVAILABILITY */}

              <div className="flex items-center gap-3">

                <input
                  id="coffee-availability"
                  type="checkbox"
                  checked={
                    form.is_available
                  }
                  onChange={(event) =>
                    handleChange(
                      "is_available",
                      event.target.checked
                    )
                  }
                  className="w-4 h-4"
                />

                <label
                  htmlFor="coffee-availability"
                  className="text-gray-700 font-medium"
                >
                  Coffee is available
                </label>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-lg font-medium disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : editingCoffee
                    ? "Update Coffee"
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

export default CoffeeManagement;