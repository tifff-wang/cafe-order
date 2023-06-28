// -- JAVASCRIPT CAFE! -- //
//Products//
let product = {
  whiteCoffee: {
    stock: 4,
    price: 4,
  },

  blackCoffee: {
    stock: 7,
    price: 3.5,
  },

  muffin: {
    stock: 5,
    price: 8.5,
  },

  eggs: {
    stock: 6,
    price: 12.5,
  },
}

function displayProducts() {
  document.getElementById(
    'whiteCoffee'
  ).innerHTML = `White Coffee Stock: ${product.whiteCoffee.stock}`

  document.getElementById(
    'blackCoffee'
  ).innerHTML = `Black Coffee Stock: ${product.blackCoffee.stock}`

  document.getElementById(
    'muffin'
  ).innerHTML = `Muffin Stock: ${product.muffin.stock}`

  document.getElementById(
    'eggs'
  ).innerHTML = `Eggs Stock: ${product.eggs.stock}`
}
displayProducts()

//Customers//
let customer = {
  order: [],
}

let minOrderSize = 1
let maxOrderSize = 5

function generateCustomerOrder() {
  let orderSize = getRandomInt(minOrderSize, maxOrderSize)

  let newOrder = []
  let productNames = Object.keys(product)

  for (let i = 0; i <= orderSize - 1; i++) {
    let productIndex = getRandomInt(0, productNames.length - 1)
    let productName = productNames[productIndex]
    newOrder.push(productName)
  }
  customer.order = newOrder
  displayCustomerOrder()
}

function displayCustomerOrder() {
  document.getElementById(
    'customerOrder'
  ).innerHTML = `Customer Order: ${customer.order}`
  console.log(customer.order)
}

document.getElementById('customerButton').onclick = generateCustomerOrder

//Transaction//
let cash = 0

function displayCash() {
  document.getElementById('cash').innerHTML = `Cash: $ ${cash}`
}
displayCash()

function fillOrder() {
  let saleTotal = 0
  let customerPayment = getRandomInt(5, 50)
  for (let i = 0; i < customer.order.length; i++) {
    let productName = customer.order[i]
    if (product[productName].stock > 0) {
      product[productName].stock--
      saleTotal += product[productName].price
    } else {
      alert(`I'm sorry, we're out of ${productName}`)
      //product text to turn red when we run out of a particular product
      document
        .getElementById(`${productName}`)
        .setAttribute('style', 'color:red')
    }
  }

  if (customerPayment >= saleTotal) {
    cash += saleTotal
    displayCash()
    displayProducts()
    customer.order = []
    displayCustomerOrder()
  } else {
    let debt = saleTotal - customerPayment
    alert(
      `Total Charge: $ ${saleTotal} \nCustomer Payment: $ ${customerPayment} \nSorry, not enough payment, needs to pay ${debt} more.`
    )
  }
}

document.getElementById('fillOrderButton').onclick = fillOrder

//Generate a random number//
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
