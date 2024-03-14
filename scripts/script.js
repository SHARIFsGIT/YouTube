// getting all categories
const loadData = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/videos/categories");
  const data = await res.json();
  const categories = data.data;
  createCategories(categories);
};
loadData();

// getting each category buttons with ID
const createCategories = (categories) => {
  const categoriesSection = document.getElementById("category-section");
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button onclick="getCategoryDetails('${category.category_id}'), activeBtn(event)" id="first" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-md active">
      ${category.category}
    </button>`;
    categoriesSection.appendChild(div);
  });
  defaultActiveBtn();
};

// making all buttons as active button
const defaultActiveBtn = () => {
  const defaultActiveBtn = document.querySelector("#first");
  defaultActiveBtn.classList.add("active-btn");
};

// making the clicked button as active button
const activeBtn = (event) => {
  const categoryBtn = document.querySelectorAll(".active");
  categoryBtn.forEach((eachBtn) => {
    eachBtn.classList.remove("active-btn");
  });
  event.target.classList.add("active-btn");
};

// getting all category data
let categoryDetailsArray;
const getCategoryDetails = async (id) => {
  toggleLoadingSpinner(true);
  const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
  const categoryData = await res.json();
  categoryDetailsArray = categoryData.data;
  showCategoryDetails(categoryDetailsArray);
};

// sorting all data
const sortByView = (event) => {
  // sort button getting active
  event.classList.add("active-btn");
  // compare category
  categoryDetailsArray.sort((item1, item2) => {
    // split the view numbers
    let view1 = item1.others.views.split("");
    // pop out from the array
    view1.pop();
    let view2 = item2.others.views.split("");
    view2.pop();
    // getting the more views
    return parseFloat(view2.join("")) - parseFloat(view1.join(""));
  });
  showCategoryDetails(categoryDetailsArray);
};

// showing category details
const showCategoryDetails = (details) => {
  const showCategoryField = document.getElementById("show-category-section");
  showCategoryField.textContent = "";
  if (details.length === 0) {
    const noData = document.createElement("div");
    noData.classList = `col-span-4 flex flex-col justify-center items-center`;
    noData.innerHTML = `
    <figure class="px-10 pt-16 flex justify-center items-center">
      <img src="images/Icon.png" class="w-full"/>
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title text-3xl font-bold mt-10">
        Oops!! Sorry <br /> There is no data found
      </h2>
    </div>
    `;
    showCategoryField.appendChild(noData);
  } 
  else {
    details.forEach((detail) => {
      const card = document.createElement("div");
      let timeArr = calculatePostedTime(detail.others.posted_date);
      let [hrs, min] = timeArr;
      card.classList = `card card-compact rounded-lg hover:scale-105 duration-700`;
      card.innerHTML =`
        <figure class="h-48 relative">
          <img class="rounded-lg w-full h-full" src=${detail.thumbnail} alt="" />
          <div id="posted-date" class="rounded-md absolute bg-[#09090b70] bottom-3 right-3 text-white text-sm px-2 py-1">${timeArr.length ? hrs + " hr" + " " + min + " min" : "Just Now"}
          </div>
        </figure>
        <div class="flex gap-2 py-5">
          <div class="h-10 w-10">
            <img class="h-full w-full rounded-full" src=${detail.authors[0].profile_picture} alt="" />
          </div>
          <div class="flex-grow">
            <h2 class="text-md font-semibold">${detail.title}</h2>
            <div class="flex items-center gap-2">
              <p class="text-sm">${detail.authors[0].profile_name}</p>
              <div id="verify" class="w-4">
                <img class="w-full" src="images/verify.png" alt="" />
              </div>
            </div>
            <p class="text-sm">${detail.others.views}</p>
          </div>
        </div>`;
      showCategoryField.appendChild(card);
    });
  }
  toggleLoadingSpinner(false);
};

// date to time conversion
const calculatePostedTime = (second) => {
  let timeArr = [];
  let nowSecond = parseInt(second);
  if (nowSecond) {
    hr = parseInt(nowSecond / (60 * 60));
    timeArr.push(hr);
    nowSecond = parseInt(nowSecond % (60 * 60));
    min = parseInt(nowSecond / 60);
    timeArr.push(min);
  }
  return timeArr;
};

// spinner to show
const toggleLoadingSpinner = (isLoading) => {
  const spinnerField = document.getElementById("loading-spinner");
  if (isLoading) {
    spinnerField.classList.remove("hidden");
  } else {
    spinnerField.classList.add("hidden");
  }
};
getCategoryDetails('1000');