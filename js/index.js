class CurrencyConverter {
  #dolarToBRL;
  #realToUSD;
  #euroToBRL;
  #realToEUR;
  #dolarToEUR;
  #euroToUSD;

  constructor() {
    this.#dolarToBRL = 0;
    this.#realToUSD = 0;
    this.#euroToBRL = 0;
    this.#realToEUR = 0;
    this.#dolarToEUR = 0;
    this.#euroToUSD = 0;
    this.createDateUSD = "";
    this.createDateEUR = "";
    this.amount = document.getElementById("amount");
    this.fromCurrency = document.getElementById("from");
    this.toCurrency = document.getElementById("to");
    this.result = document.getElementById("result");
    
    //CURRENCY FORMATS
    this.formatterBR = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    });
    this.formatterUS = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    });
    this.formatterEU = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2
    });
  }

  //GETTERS FUNCTIONS
  getUSDToBRL() {
    return this.#dolarToBRL;
  }

  getEURToBRL() {
    return this.#euroToBRL;
  }

  //SETTERS FUNCTIONS
  setUSDToBRL(value) {
    this.#dolarToBRL = value;
  }

  setBRLToUSD(value) {
    this.#realToUSD = value;
  }

  setEURToBRL(value) {
    this.#euroToBRL = value;
  }

  setBRLToEUR(value) {
    this.#realToEUR = value;
  }

  setUSDToEUR(value) {
    this.#dolarToEUR = value;
  }

  setEURToUSD(value) {
    this.#euroToUSD = value;
  }

  currencyOperation() {
    const from = this.fromCurrency.value;
    const to = this.toCurrency.value;
    let calculate = "";

    if (from === "USD" && to === "BRL") {
      calculate = (this.amount.value * this.#dolarToBRL).toFixed(2);
    } else if (from === "BRL" && to === "USD") {
      calculate = (this.amount.value * this.#realToUSD).toFixed(2);
    } else if (from === "EUR" && to === "BRL") {
      calculate = (this.amount.value * this.#euroToBRL).toFixed(2);
    } else if (from === "BRL" && to === "EUR") {
      calculate = (this.amount.value * this.#realToEUR).toFixed(2);
    } else if (from === "USD" && to === "EUR") {
      calculate = (this.amount.value * this.#dolarToEUR).toFixed(2);
    } else if (from === "EUR" && to === "USD") {
      calculate = (this.amount.value * this.#euroToUSD).toFixed(2);
    } else {
      const errorNotice = document.createElement("p");
      const divNotice = document.getElementById("errorNotice");
      errorNotice.style.color = "red";
      errorNotice.innerHTML = "Selecione moedas diferentes";
      errorNotice.style.marginTop = "5px";
      divNotice.appendChild(errorNotice);

      return calculate = false;
    }

    return calculate;
  }
}

const currencyConverter = new CurrencyConverter();

async function getCurrency() {
  const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,BRL-USD,EUR-BRL,BRL-EUR,USD-EUR,EUR-USD");
  if (response.ok) {
    return response.json();
  } else {
    alert("Erro inesperado, por favor volte mais tarde");
  }
}

getCurrency().then(data => {
  currencyConverter.setUSDToBRL(data.USDBRL.bid);
  currencyConverter.setBRLToUSD(data.BRLUSD.bid);
  currencyConverter.setEURToBRL(data.EURBRL.bid);
  currencyConverter.setBRLToEUR(data.BRLEUR.bid);
  currencyConverter.setUSDToEUR(data.USDEUR.bid);
  currencyConverter.setEURToUSD(data.EURUSD.bid);
  currencyConverter.createDateUSD = data.USDBRL.create_date;
  currencyConverter.createDateEUR = data.EURBRL.create_date;
});

function convertAmount() {
  const result = currencyConverter.currencyOperation();
  const from = currencyConverter.fromCurrency.value;
  const to = currencyConverter.toCurrency.value;

  if (currencyConverter.amount.value === "") {
    currencyConverter.result.innerHTML = "Preencha a quantia";
  } else if (result === false) {
    currencyConverter.result.innerHTML = "Preencha novamente";
  } else {
    if (to === "USD") {
      currencyConverter.result.innerHTML = currencyConverter.formatterUS.format(result);
    } else if (to === "BRL") {
      currencyConverter.result.innerHTML = currencyConverter.formatterBR.format(result);
    } else if (to === "EUR") {
      currencyConverter.result.innerHTML = currencyConverter.formatterEU.format(result);
    }
  }

  currencyConverter.amount.value = "";
  from.value = "USD";
  to.value = "BRL";
}

function switchCurrency() {
  let aux = currencyConverter.fromCurrency.value;
  currencyConverter.fromCurrency.value = currencyConverter.toCurrency.value;
  currencyConverter.toCurrency.value = aux;
}

function currencyReference() {
  const dolarReference = document.getElementById("dolar-reference");
  const euroReference = document.getElementById("euro-reference");
  const gifLoading = document.createElement("img");
  gifLoading.src = "./images/gif-loading.gif";
  gifLoading.style.width = "30px";
  dolarReference.appendChild(gifLoading);
  setInterval(() => {
    dolarReference.innerHTML = `D??lar: ${currencyConverter.getUSDToBRL()} (Atualizado: ${currencyConverter.createDateUSD})`;
    euroReference.innerHTML = `Euro: ${currencyConverter.getEURToBRL()} (Atualizado: ${currencyConverter.createDateEUR})`;
  }, 2000);
}

currencyReference();