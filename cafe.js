// -- JAVASCRIPT CAFE! -- //
//Products//
let product = {
  whiteCoffee: {
    stock: 7,
    price: 4,
    wholesaleCost: 1,
  },

  blackCoffee: {
    stock: 7,
    price: 3.5,
    wholesaleCost: 0.5,
  },

  muffin: {
    stock: 5,
    price: 8.5,
    wholesaleCost: 3,
  },

  eggs: {
    stock: 6,
    price: 12.5,
    wholesaleCost: 2,
  },
}

let orderHistories = []

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

  for (let i = 0; i <= newOrder.length; i++) {
    if (newOrder[i] === 'eggs') {
      document
        .getElementById('eggCookChoice')
        .setAttribute('style', 'display:block')
    }
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

function howEggCooked() {
  let radios = document.getElementsByName('cookEgg')
  let eggName
  let customerOrderText = document.getElementById('customerOrder').innerHTML
  let updateText

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      eggName = `${radios[i].value}-eggs`
    }
  }
  if (customer.order.includes('eggs')) {
    updateText = customerOrderText.replaceAll('eggs', eggName)
    document.getElementById('customerOrder').innerHTML = updateText
    radios[0].checked = 'checked'
  }
}

document.getElementById('eggButton').onclick = howEggCooked

function validateOrder(customerPayment) {
  /*
  result = {
    'isValidPayment' : true/false,
    'foodCount': {'egg': 2...},
    'foodOutOfStok': ['whiteCoffee'..]
    'totalPrice': 12
  }
  */
  let result = {}

  let foodCount = {}
  let totalPrice = 0
  let foodOutOfStock = []

  customer.order.forEach((item) => {
    totalPrice += product[item].price
    if (!foodCount[item]) {
      foodCount[item] = 1
    } else {
      foodCount[item] += 1
    }
  })
  result['foodCount'] = foodCount
  result['totalPrice'] = totalPrice

  Object.keys(product).forEach((key) => {
    if (product[key].stock < foodCount[key]) {
      foodOutOfStock.push(key)
    }
  })
  result['foodOutOfStock'] = foodOutOfStock

  let isValidPayment = customerPayment >= totalPrice
  result['isValidPayment'] = isValidPayment

  return result
}

document.getElementById('customerButton').onclick = generateCustomerOrder

//Transaction//
let cash = 0

function displayCash() {
  document.getElementById('cash').innerHTML = `Cash: $ ${cash}`
}
displayCash()

function fillOrder() {
  let customerPayment = getRandomInt(30, 50)
  let result = validateOrder(customerPayment)

  if (!result.isValidPayment) {
    let debt = result.totalPrice - customerPayment
    alert(
      `Total Charge: $${result.totalPrice} \nCustomer Payment: $${customerPayment} \nSorry, not enough payment, needs to pay $${debt} more.`
    )
  } else if (result.foodOutOfStock.length > 0) {
    const foodStr = result.foodOutOfStock.join(', ')
    alert(
      `${foodStr} ${
        result.foodOutOfStock.length == 1 ? 'is' : 'are'
      } out of stock`
    )
  } else {
    cash += result.totalPrice
    displayCash()

    Object.keys(result.foodCount).forEach((item) => {
      product[item].stock -= result.foodCount[item]
      if (product[item].stock <= 0) {
        document.getElementById(`${item}`).setAttribute('style', 'color: red')
      }
    })

    displayProducts()
    displayOrderHistory(result)

    customer.order = []
    displayCustomerOrder()

    document
      .getElementById('eggCookChoice')
      .setAttribute('style', 'display:none')
  }
}

document.getElementById('fillOrderButton').onclick = fillOrder

//Wholesale cost and restock
function addStock(productName) {
  const food = product[productName]
  if (cash >= food.wholesaleCost) {
    console.log(food.stock)
    food.stock += 1
    document
      .getElementById(`${productName}`)
      .setAttribute('style', 'color:black')
    displayProducts()

    cash -= food.wholesaleCost
    displayCash()
  } else {
    alert('Out of cash!')
  }
}

document.getElementById('restockWhiteCoffee').onclick = function () {
  addStock('whiteCoffee')
}

document.getElementById('restockBlackCoffee').onclick = function () {
  addStock('blackCoffee')
}
document.getElementById('restockMuffin').onclick = function () {
  addStock('muffin')
}
document.getElementById('restockEggs').onclick = function () {
  addStock('eggs')
}

//Generate a random number//
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function displayOrderHistory(result) {
  const id = Date.now()
  let orderHistory = {
    id: id,
    foodCount: result.foodCount,
    totalPrice: result.totalPrice,
  }

  orderHistories.push(orderHistory)

  let orderHistoryArray = []

  Object.keys(result.foodCount).forEach((item) => {
    let string = `${item}: ${result.foodCount[item]}`
    orderHistoryArray.push(string)
  })

  let foodOrdered = orderHistoryArray.join(', ')

  let orderHistoryDisplay = `ID:${orderHistory.id}, Food Ordered: ${foodOrdered}, Total Price: $${orderHistory.totalPrice}`

  let myDiv = document.getElementById('orderHistory')
  let myInnerHTML = document.createElement('div')
  myInnerHTML.innerHTML = `
  <div id="${id}">
  <p>${orderHistoryDisplay}</p>
  <button onclick = "
  refund(${id})
  ">refund</button>
  </div>`
  myDiv.appendChild(myInnerHTML)
}

function refund(id) {
  alert('Customer Comment: Not happy with the food.')
  let refundOrderIndex
  let orderHistory
  for (let i = 0; i < orderHistories.length; i++) {
    if (orderHistories[i].id === id) {
      orderHistory = orderHistories[i]
      refundOrderIndex = i
      break
    }
  }

  let refundPrice = orderHistory.totalPrice
  cash -= refundPrice
  orderHistories.splice(refundOrderIndex, 1)
  displayCash()

  document.getElementById(`${id}`).remove()
}
