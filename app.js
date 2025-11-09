const cl = console.log;

const dishForm = document.getElementById("dishForm");
const dishContainer = document.getElementById("dishContainer");
const dishNameCntrl = document.getElementById("dishName");
const categoryCntrl = document.getElementById("category");
const priceCntrl = document.getElementById("price");
const descriptionCntrl = document.getElementById("description");
const submitDishBtn = document.getElementById("submitDishBtn");
const updateDishBtn = document.getElementById("updateDishBtn");

let vegMenu;
if (localStorage.getItem("vegMenu")) {
  vegMenu = JSON.parse(localStorage.getItem("vegMenu"));
} else {
  vegMenu = [
    { dishName: "Paneer Butter Masala", category: "Main Course", price: 180, description: "Soft paneer cubes in creamy tomato gravy.", id: "1" },
    { dishName: "Veg Biryani", category: "Rice", price: 150, description: "Fragrant basmati rice cooked with mixed vegetables and spices.", id: "2" },
  ];
}
cl(vegMenu);

const uuid = () => {
  return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const createDishTable = (arr) => {
  let res = "";
  arr.forEach((dish, i) => {
    res += `
      <tr id="${dish.id}">
        <td>${i + 1}</td>
        <td>${dish.dishName}</td>
        <td>${dish.category}</td>
        <td>₹${dish.price}</td>
        <td>${dish.description}</td>
        <td><i class="fa-solid fa-pen-to-square text-success" onclick="onEdit(this)"></i></td>
        <td><i class="fa-solid fa-trash text-danger" onclick="onRemove(this)"></i></td>
      </tr>`;
  });
  dishContainer.innerHTML = res;
};
createDishTable(vegMenu);

let EDIT_ID;

const onEdit = (ele) => {
  EDIT_ID = ele.closest("tr").id;
  let EDIT_OBJ = vegMenu.find(d => d.id === EDIT_ID);

  dishNameCntrl.value = EDIT_OBJ.dishName;
  categoryCntrl.value = EDIT_OBJ.category;
  priceCntrl.value = EDIT_OBJ.price;
  descriptionCntrl.value = EDIT_OBJ.description;

  updateDishBtn.classList.remove("d-none");
  submitDishBtn.classList.add("d-none");
};

const onRemove = (ele) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to remove this dish?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let REMOVE_ID = ele.closest("tr").id;
      let getIndex = vegMenu.findIndex(d => d.id === REMOVE_ID);
      vegMenu.splice(getIndex, 1);

      localStorage.setItem("vegMenu", JSON.stringify(vegMenu));
      ele.closest("tr").remove();

      Swal.fire("Deleted!", "Dish removed successfully.", "success");
    }
  });
};

const onSubmit = (e) => {
  e.preventDefault();

  let dishObj = {
    dishName: dishNameCntrl.value,
    category: categoryCntrl.value,
    price: priceCntrl.value,
    description: descriptionCntrl.value,
    id: uuid()
  };

  vegMenu.push(dishObj);
  localStorage.setItem("vegMenu", JSON.stringify(vegMenu));
  dishForm.reset();
  createDishTable(vegMenu);

  Swal.fire("Added!", "Dish added successfully.", "success");
};

const onUpdate = () => {
  let UPDATE_OBJ = {
    dishName: dishNameCntrl.value,
    category: categoryCntrl.value,
    price: priceCntrl.value,
    description: descriptionCntrl.value,
    id: EDIT_ID
  };

  let getIndex = vegMenu.findIndex(d => d.id === EDIT_ID);
  vegMenu[getIndex] = UPDATE_OBJ;

  localStorage.setItem("vegMenu", JSON.stringify(vegMenu));
  dishForm.reset();
  createDishTable(vegMenu);

  updateDishBtn.classList.add("d-none");
  submitDishBtn.classList.remove("d-none");

  Swal.fire("Updated!", "Dish updated successfully.", "success");
};

dishForm.addEventListener("submit", onSubmit);
updateDishBtn.addEventListener("click", onUpdate);
