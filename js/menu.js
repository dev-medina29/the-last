const data = async () => {
  const response = await fetch("../data/menu.json");
  const result = await response.json();
  return result;
};
const menuContainer = document.querySelector("#menu");
data().then((menu) => {
  const mydata = menu.menus;
  console.log(mydata);
  // console.log(mydata[0].items[0].item);
  let pageNum = 1;
  mydata.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    // console.log(item);
    // console.log(item.name);
    console.log(item.items);
    h1 = document.createElement("h1");
    h1.textContent = item.name;
    menuItem.appendChild(h1);
    console.log(item.items[0].item);
    item.items.forEach((subItem) => {
      const subMenuItem = document.createElement("p");
      subMenuItem.classList.add("menu-item");
      subMenuItem.innerHTML = `<strong>${subItem.item}</strong> - ${subItem.price.toFixed(2)} FCFA`;
      menuItem.appendChild(subMenuItem);
      pageNum++;
    });
    menuContainer.appendChild(menuItem);
  });
});
