// Function that retrieves user information from local storage
function getUserInfo() {
  const userDataString = localStorage.getItem('userData');
  if (userDataString) {
    return JSON.parse(userDataString);
  }
  return {};
}

// Function to filter and limit wallet items by type
function filterAndLimitItems(items, type) {
  return items.filter(item => item.type === type).slice(0, 3);
}

// Function to get the appropriate icon class based on wallet item type
function getIconClass(type) {
  switch (type) {
    case 'cash':
      return 'fa fa-money-bill text-black dark:text-gray-800';
    case 'card':
      return 'fa fa-credit-card text-black dark:text-gray-800';
    case 'payment':
      return 'fa fa-wallet text-black dark:text-gray-800';
    case 'stock':
      return 'fa fa-chart-line text-black dark:text-gray-800';
    case 'recharge':
      return 'fa fa-address-card text-black dark:text-gray-800';
    case 'loan':
      return 'fa fa-money-bill-wave text-black dark:text-gray-800';
    default:
      return 'fa fa-question-circle text-black dark:text-gray-800';
  }
}

// Function to generate card elements for a specific section
function generateCardElements(sectionId, type, items) {
  const container = document.getElementById(sectionId);

  if (container) {
    const fragment = document.createDocumentFragment();

    items.forEach(item => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('flex', 'items-center', 'mb-4');

      const iconClass = getIconClass(item.type);
      if (iconClass) {
        const iconElement = document.createElement('i');
        iconElement.className = iconClass;
        cardElement.appendChild(iconElement);
      } else {
        console.error(`Invalid iconClass for type: ${type}`);
      }

      const nameElement = document.createElement('p');
      nameElement.classList.add('text-sm', 'text-gray-600', 'dark:text-gray-900', 'mt-1', 'ml-2');
      nameElement.textContent = item.name;
      cardElement.appendChild(nameElement);

      const amountElement = document.createElement('p');
      amountElement.classList.add('ml-auto', 'text-sm', 'text-gray-600', 'dark:text-gray-900', 'mt-1');
      amountElement.textContent = `$${item.amount}`;
      cardElement.appendChild(amountElement);

      fragment.appendChild(cardElement);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
  } else {
    console.error(`Container not found for sectionId: ${sectionId}`);
  }
}

// Function to display wallet data for each section
function displayWalletData() {
  // Retrieve user data from local storage
  const userData = getUserInfo();
  const walletItems = userData.walletItems || [];

  // Define sections with corresponding IDs and types
  const sections = [
    { id: 'cashSection', type: 'cash' },
    { id: 'cardsSection', type: 'card' }, 
    { id: 'onlinePaymentSection', type: 'payment' },
    { id: 'stocksSection', type: 'stock' },
    { id: 'rechargeCardsSection', type: 'recharge' },
    { id: 'loanSection', type: 'loan' },
  ];

  // Display cards for each section
  sections.forEach(section => {
    const items = filterAndLimitItems(walletItems, section.type);
    generateCardElements(section.id, section.type, items);
  });
}

// Function to fetch and update local storage
async function fetchAndUpdateLocalStorage() {
  try {
    const userInfo = await getUserInfo();
  
    const userId = userInfo && userInfo._id.toString();
  
    if (!userId) {
      console.error('User ID not found in userInfo.');
      return;
    }
  
    const response = await fetch(`http://localhost:8082/getUserData?userId=${userId}`);
    const userData = await response.json();

  
    if (userData && userData.user) {
      // Remove the specific property
      delete localStorage.userData;
      // Store the user data in local storage
      localStorage.setItem('userData', JSON.stringify(userData.user));

    } else {
      console.error('No userData.userData found in the response:', userData);
    }
  } catch (error) {
    console.error('Error fetching and updating local storage:', error);
  }
}

// Function to fetch and update local storage on load
async function fetchLocalStorage() {
  await fetchAndUpdateLocalStorage();
  displayWalletData(); // Call the function to display wallet data after updating local storage

  const userData = getUserInfo();
  // Check if username exists
  if (userData.username) {
    // Update the content of the element with the username
    const usernamePlaceholder = document.getElementById('usernamePlaceholder');
    if (usernamePlaceholder) {
      usernamePlaceholder.textContent = userData.username;
    }
  }
}

function handleButtonClick(buttonId) {
  const buttons = ['expensesBtn', 'incomeBtn', 'transferBtn'];
  const submitButton = document.getElementById('buttonSection');

  let incomeButton = document.getElementById('incomeBtn');
  let expensesButton = document.getElementById('expensesBtn');
  let transferButton = document.getElementById('transferBtn');
  let amountField = document.getElementById('amountField');
  let amountInput = document.getElementById('amount');
  let transferField = document.getElementById('transferFields');
  let transferHide = document.getElementById('transferHide');

  buttons.forEach((btn, index) => {
    const button = document.getElementById(btn);

    if (buttonId === btn) {
      getCurrentDateTime();
      button.classList.remove('bg-gray-600', 'text-gray-200');
      button.classList.add('bg-green-100', 'text-black');
      switch (buttonId) {
        case 'expensesBtn':
          transferHide.classList.remove('hidden');
          transferField.classList.add('hidden');
          amountField.classList.remove('text-green-300', 'text-blue-400');
          amountInput.classList.remove('focus:border-green-300', 'text-green-400', 'focus:border-blue-300', 'text-blue-400');
          amountField.classList.add('text-red-300');
          amountInput.classList.add('focus:border-red-400', 'text-red-400');
          expensesButton.classList.remove('hover:bg-red-600');
          expensesButton.classList.add('hover:cursor-default');
          transferButton.classList.remove('hover:cursor-default');
          transferButton.classList.add('hover:bg-blue-600');
          incomeButton.classList.remove('hover:cursor-default');
          incomeButton.classList.add('hover:bg-green-600');
          submitButton.classList.remove('hover:bg-blue-400');
          submitButton.classList.remove('hover:bg-green-400');
          submitButton.classList.add('hover:bg-red-400');
          break;
        case 'incomeBtn':
          transferHide.classList.remove('hidden');
          transferField.classList.add('hidden');
          amountField.classList.remove('text-red-300', 'text-blue-400');
          amountInput.classList.remove('focus:border-red-400', 'text-red-400', 'focus:border-blue-300', 'text-blue-400');
          amountField.classList.add('text-green-300');
          amountInput.classList.add('focus:border-green-300', 'text-green-400');
          incomeButton.classList.remove('hover:bg-green-600');
          incomeButton.classList.add('hover:cursor-default');
          transferButton.classList.add('hover:bg-blue-600');
          transferButton.classList.remove('hover:cursor-default');
          expensesButton.classList.add('hover:bg-red-600');
          expensesButton.classList.remove('hover:cursor-default');
          submitButton.classList.remove('hover:bg-blue-400');
          submitButton.classList.remove('hover:bg-red-400');
          submitButton.classList.add('hover:bg-green-400');
          break;
        case 'transferBtn':
          transferHide.classList.add('hidden');
          transferField.classList.remove('hidden');
          amountField.classList.remove('text-red-300', 'text-green-400');
          amountInput.classList.remove('focus:border-red-400', 'text-red-400', 'focus:border-green-300', 'text-green-400');
          amountField.classList.add('text-blue-400');
          amountInput.classList.add('focus:border-blue-300', 'text-blue-400');
          transferButton.classList.remove('hover:bg-blue-600');
          transferButton.classList.add('hover:cursor-default');
          incomeButton.classList.add('hover:bg-green-600');
          incomeButton.classList.remove('hover:cursor-default');
          expensesButton.classList.add('hover:bg-red-600');
          expensesButton.classList.remove('hover:cursor-default');
          submitButton.classList.remove('hover:bg-red-400');
          submitButton.classList.remove('hover:bg-green-400');
          submitButton.classList.add('hover:bg-blue-400');
          break;
        default:
          submitButton.style.backgroundColor = '';
          break;
      }
    } else {
      button.classList.remove('bg-green-100', 'text-black');
      button.classList.add('bg-gray-600', 'text-gray-200');
    }
  });
}



function redirectToAccount() {
  sessionStorage.setItem('activeSection', 'wallet-btn');

  // Redirect to the account page
  window.location.href = 'account.html';

}


// Function to get the selected type
function getSelectedType() {
  const expensesBtn = document.getElementById('expensesBtn');
  const incomeBtn = document.getElementById('incomeBtn');
  const transferBtn = document.getElementById('transferBtn');

  if (expensesBtn && expensesBtn.classList.contains('bg-green-100')) {
    return 'expenses';
  } else if (incomeBtn && incomeBtn.classList.contains('bg-green-100')) {
    return 'income';
  } else if (transferBtn && transferBtn.classList.contains('bg-green-100')) {
    return 'transfer';
  }

  return '';
}

// Function to generate the account dropdown
function populateAccountDropdown(account, dropdownId) {
  const accountDropdown = document.getElementById(dropdownId);
  if (accountDropdown) {
    accountDropdown.innerHTML = ''; // Clear existing options
    const userData = getUserInfo();
    const storedAccounts = userData.walletItems || [];

    storedAccounts.forEach(account => {
      if (account.name) {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        accountDropdown.appendChild(option);
      }
    });
  }
  
}

// Function to handle the submit button
async function handleTransactionSubmit(event) {
  try {
    event.preventDefault();
    const type = getSelectedType();
    const account = document.getElementById('account').value;
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const notes = document.getElementById('notes').value;
    const transactionDateTime = document.getElementById('transactionDateTime').value;

    // Get additional fields based on the transaction type
    let additionalFields = {};
    if (type === 'transfer') {
      additionalFields = {
        exchangeRate: document.getElementById('exchangeRate').value,
        paymentAccount: document.getElementById('paymentAccount').value,
        exchangeRatePay: document.getElementById('exchangeRatePay').value,
        receiveAccount: document.getElementById('receiveAccount').value,
        exchangeRateReceive: document.getElementById('exchangeRateReceive').value,
      };
    }

    // Prepare the data to be sent to the server
    const transactionData = {
      account,
      type,
      amount,
      currency,
      notes,
      transactionDateTime,
      ...additionalFields,
    };

    // Fetch the user data to get the userId
    await fetchAndUpdateLocalStorage();

    // Get the userId from local storage
    const userData = getUserInfo();
    const userId = userData._id;

    // Make a POST request to the server to handle the transaction
    const response = await fetch(`http://localhost:8082/submitTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...transactionData }),
    });

    const result = await response.json();

    if (response.ok) {
      // Transaction added successfully, update the local storage and display wallet data
      await fetchAndUpdateLocalStorage();
      location.reload();

      // Optionally, close the modal or reset the form
      document.getElementById('addTransactionMenu').reset();
      document.getElementById('addMenu').classList.add('hidden');
    } else {
      const errorMessageElement = document.getElementById('errorMessage');

      if (response.status === 400 && result.error === 'Payment and receive accounts must be different.') {
        errorMessageElement.textContent = 'Payment and receive accounts must be different.';
      } else {
        errorMessageElement.textContent = `Error: ${result.error || 'Unknown error'}`;
      }
      errorMessageElement.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error handling transaction submit:', error);
  }
}

// Function to retrieve transaction history from local storage
function getTransactionHistoryFromLocalStorage() {
  const userData = getUserInfo();
  const transactionHistory = userData.transactionHistory || [];
  return transactionHistory;
}

function populateTransactionHistory() {
  const transactionHistory = getTransactionHistoryFromLocalStorage();
  const transactionHistoryContainer = document.getElementById('transactionHistory');

  // Clear previous content
  transactionHistoryContainer.innerHTML = '';

  // Group transactions by date
  const transactionsByDate = new Map();
  transactionHistory.forEach(transaction => {
    const transactionDate = new Date(transaction.timestamp);
    const formattedDate = transactionDate.toLocaleDateString('en-US');

    if (!transactionsByDate.has(formattedDate)) {
      transactionsByDate.set(formattedDate, []);
    }

    transactionsByDate.get(formattedDate).push(transaction);
  });

  // Sort dates in reverse order (newest to oldest)
  const sortedDates = Array.from(transactionsByDate.keys()).sort((a, b) => new Date(b) - new Date(a));

  // Iterate over sorted dates and create HTML elements
  sortedDates.forEach(formattedDate => {
    // Create date element
    const dateElement = document.createElement('div');
    dateElement.classList.add('font-bold', 'text-lg');
    dateElement.textContent = formattedDate;
    transactionHistoryContainer.appendChild(dateElement);

    // Sort transactions within each date group in reverse order (newest to oldest)
    const transactions = transactionsByDate.get(formattedDate).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      const formattedTime = transactionDate.toLocaleTimeString('en-US');

      // Create transaction details based on type
      const transactionDetails = document.createElement('div');
      transactionDetails.classList.add('ml-4');

      if (transaction.type === 'expenses' || transaction.type === 'income') {
        const accountElement = createAccountElement(
          transaction.type === 'expenses' ? 'red' : 'green',
          transaction.account,
          transaction.amount,
          transaction
        );
        const timeElement = createTimeElement(formattedTime);
        const notesElement = createNotesElement(transaction.notes);

        transactionDetails.appendChild(accountElement);
        transactionDetails.appendChild(timeElement);
        transactionDetails.appendChild(notesElement);
      } else if (transaction.type === 'transfer') {
        const accountElement = createAccountElement('light-blue', transaction.account, transaction.amount, transaction);
        const timeElement = createTimeElement(formattedTime);
        const notesElement = createNotesElement(transaction.notes);

        transactionDetails.appendChild(accountElement);
        transactionDetails.appendChild(timeElement);
        transactionDetails.appendChild(notesElement);
      } else {
        // Handle other transaction types
      }

      transactionHistoryContainer.appendChild(transactionDetails);

      // Add additional spacing between transactions
      const spacingElement = document.createElement('div');
      spacingElement.style.height = '10px'; // Adjust the height as needed
      transactionHistoryContainer.appendChild(spacingElement);
    });
  });
}


function createAccountElement(color, account, amount, transaction) {
  const accountElement = document.createElement('div');
  accountElement.classList.add('font-semibold', 'flex', 'justify-between');

  const amountWithSign = transaction.type === 'expenses' ? `-$${amount}` : (transaction.type === 'income' ? `+$${amount}` : `$${amount}`);

  if (transaction.type === 'expenses' || transaction.type === 'income') {
    const indicatorColorClass = transaction.type === 'expenses' ? 'text-red-500 text-2xl' : 'text-green-500 text-2xl';
    accountElement.innerHTML = `<div class="flex items-center"><span class="${indicatorColorClass}">&#8226;</span><span class="ml-2">${account}</span></div><span class="mr-4">${amountWithSign}</span>`;
  } else if (transaction.type === 'transfer') {
    const paymentAccount = transaction.paymentAccount || 'N/A';
    const receiveAccount = transaction.receiveAccount || 'N/A';
    const indicatorColorClass = 'text-blue-500 text-2xl';
    accountElement.innerHTML = `<div class="flex items-center"><span class="${indicatorColorClass}">&#8226;</span><span class="ml-2"><span class="text-red-600">${paymentAccount}</span> to <span class="text-green-500">${receiveAccount}</span></span></div><span class="mr-4">${amountWithSign}</span>`;
  } else {
    // Handle other transaction types
  }

  return accountElement;
}


function createTimeElement(formattedTime) {
  const timeElement = document.createElement('div');
  timeElement.classList.add('text-sm', 'text-gray-500');
  timeElement.textContent = formattedTime;
  return timeElement;
}

function createNotesElement(notes) {
  const notesElement = document.createElement('div');
  notesElement.textContent = notes;
  return notesElement;
}

const cardsBox = document.querySelector('#cardsbox');
if (cardsBox) {
  cardsBox.addEventListener('click', redirectToAccount);
}

// Handle the add button
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('addMenu');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    getCurrentDateTime();
    menu.classList.remove('hidden');
  });
}

// Default the current date and time
function getCurrentDateTime() {
  const singaporeTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

  // Format the date to the expected format (YYYY-MM-DDTHH:mm)
  const year = singaporeTime.getFullYear();
  const month = (singaporeTime.getMonth() + 1).toString().padStart(2, '0');
  const day = singaporeTime.getDate().toString().padStart(2, '0');
  const hours = singaporeTime.getHours().toString().padStart(2, '0');
  const minutes = singaporeTime.getMinutes().toString().padStart(2, '0');
  
  const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;


  const transactionDateTime = document.getElementById("transactionDateTime");

  if (transactionDateTime) {
    transactionDateTime.value = currentDateTime;
  }
}

// Function to create the daily expenses line chart
function createDailyExpensesChart() {
  // Get the user's transaction history
  const transactionHistory = getTransactionHistoryFromLocalStorage();

  // Filter transactions for the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1
  const currentYear = currentDate.getFullYear();

  const filteredTransactions = transactionHistory.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      return (
          transactionDate.getMonth() + 1 === currentMonth &&
          transactionDate.getFullYear() === currentYear
      );
  });

  // Group transactions by day
  const dailyExpensesData = {};
  const dailyIncomeData = {};

  filteredTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      const dayOfMonth = transactionDate.getDate();

      if (!dailyExpensesData[dayOfMonth]) {
          dailyExpensesData[dayOfMonth] = 0;
      }

      if (!dailyIncomeData[dayOfMonth]) {
          dailyIncomeData[dayOfMonth] = 0;
      }

      // Add expenses (negative amount) and income (positive amount)
      if (transaction.type === 'expenses') {
          dailyExpensesData[dayOfMonth] += parseFloat(transaction.amount);
      } else if (transaction.type === 'income') {
          dailyIncomeData[dayOfMonth] += parseFloat(transaction.amount);
      }
  });

  // Calculate daily net flow (income - expenses)
  const dailyNetFlowData = {};
  Object.keys(dailyExpensesData).forEach(day => {
      dailyNetFlowData[day] = dailyIncomeData[day] - dailyExpensesData[day];
  });

  // Convert data to arrays for Chart.js
  const labels = Object.keys(dailyExpensesData).map(day => `Day ${day}`);
  const expensesData = Object.values(dailyExpensesData);
  const incomeData = Object.values(dailyIncomeData);
  const netFlowData = Object.values(dailyNetFlowData);

  // Get the canvas element
  const dailyExpensesChartCanvas = document.getElementById('dailyExpensesChart').getContext('2d');

  // Create a line chart for daily expenses, income, and net flow
  const dailyExpensesChart = new Chart(dailyExpensesChartCanvas, {
      type: 'line',
      data: {
          labels,
          datasets: [
              {
                  label: 'Daily Expenses',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  data: expensesData,
              },
              {
                  label: 'Daily Income',
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  data: incomeData,
              },
              {
                label: 'Net Flow',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: netFlowData,
              },
          ],
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true,
              },
          },
      },
  });
}

// Handle submit button
const submitButton = document.getElementById('buttonSection');
if (submitButton) {
  submitButton.addEventListener('click', handleTransactionSubmit);
}

// Handle the close button
const closeButton = document.getElementById('closeAddModalButton');
const modal = document.getElementById('addMenu'); 
const amountInput = document.getElementById('account')

if (closeButton && modal) {
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    amountInput.removeAttribute('required'); 
    modal.classList.add('hidden'); 
  });
}


// Call the function to fetch and update local storage on load
window.addEventListener('load', fetchLocalStorage);
window.addEventListener('load', populateAccountDropdown);
window.addEventListener('load', populateTransactionHistory);
window.addEventListener('load', createDailyExpensesChart);

// Call the function to populate each dropdown
populateAccountDropdown('account', 'account');
populateAccountDropdown('paymentAccount', 'paymentAccount');
populateAccountDropdown('receiveAccount', 'receiveAccount');