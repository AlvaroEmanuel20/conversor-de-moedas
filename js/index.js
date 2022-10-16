class CurrencyConverter {
    #usdToBrl;
    #brlToUsd;
    #eurToBrl;
    #brlToEur;
    #usdToEur;
    #eurToUsd;
    #dateUSD;
    #dateEUR;

    constructor() {
        this.#usdToBrl;
        this.#brlToUsd;
        this.#eurToBrl;
        this.#brlToEur;
		this.#usdToEur;
		this.#eurToUsd;
        this.#dateUSD;
        this.#dateEUR;
        this.amount = document.getElementById("amount");
        this.fromCurrency = document.getElementById("from");
        this.toCurrency = document.getElementById("to");
        this.result = document.getElementById("result");
    }

	async getCurrency() {
		const url = "https://economia.awesomeapi.com.br/last/USD-BRL,BRL-USD,EUR-BRL,BRL-EUR,USD-EUR,EUR-USD";
		const response = await fetch(url);
		const data = await response.json();
	
		if (response.ok) {
			this.usdToBrl = data.USDBRL.bid;
			this.brlToUsd = data.BRLUSD.bid;
			this.eurToBrl = data.EURBRL.bid;
			this.brlToEur = data.BRLEUR.bid;
			this.usdToEur = data.USDEUR.bid;
			this.eurToUsd = data.EURUSD.bid;
			this.dateUSD = this.dateFormatter(data.USDBRL.create_date);
			this.dateEUR = this.dateFormatter(data.EURBRL.create_date);
		} else {
			alert("Erro inesperado, por favor volte mais tarde");
		}
	}

	currencyFormatter(money, country) {
		const formatter = new Intl.NumberFormat(country, {
            style: "currency",
            currency: money,
            minimumFractionDigits: 2,
        });

		return formatter;
	}

	dateFormatter(dateData) {
		const date = new Date(dateData);
		const day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate();
		const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

    currencyOperation() {
        const from = this.fromCurrency.value;
        const to = this.toCurrency.value;
        let resultValue = "";

        if (from === "USD" && to === "BRL") {
            resultValue = (this.amount.value * this.usdToBrl).toFixed(2);
        } else if (from === "BRL" && to === "USD") {
            resultValue = (this.amount.value * this.brlToUsd).toFixed(2);
        } else if (from === "EUR" && to === "BRL") {
            resultValue = (this.amount.value * this.eurToBrl).toFixed(2);
        } else if (from === "BRL" && to === "EUR") {
            resultValue = (this.amount.value * this.brlToEur).toFixed(2);
        } else if (from === "USD" && to === "EUR") {
            resultValue = (this.amount.value * this.usdToEur).toFixed(2);
		} else if (from === "EUR" && to === "USD") {
            resultValue = (this.amount.value * this.eurToUsd).toFixed(2);
		} else {
            this.errorMessage();
            return resultValue = false;
        }

        return resultValue;
    }

	errorMessage() {
		const errorNotice = document.createElement("p");
		const divNotice = document.getElementById("errorNotice");
		errorNotice.style.color = "red";
		errorNotice.innerHTML = "Selecione moedas diferentes";
		errorNotice.style.marginTop = "5px";
		divNotice.appendChild(errorNotice);

		setTimeout(() => divNotice.removeChild(errorNotice), 1000);
	}

	currencyReference() {
		const dolarReference = document.getElementById("dolar-reference");
		const euroReference = document.getElementById("euro-reference");
		
		const gifLoading = document.createElement("img");
		gifLoading.src = "./images/gif-loading.gif";
		gifLoading.style.width = "30px";
		dolarReference.appendChild(gifLoading);
	
		setInterval(() => {
			dolarReference.innerHTML = `Dólar: ${this.usdToBrl} (Atualizado: ${this.dateUSD})`;
			euroReference.innerHTML = `Euro: ${this.eurToBrl} (Atualizado: ${this.dateEUR})`;
		}, 1500);
	}
}

const converter = new CurrencyConverter();
converter.getCurrency();
converter.currencyReference();

function convertAmount() {
	const resultValue = converter.currencyOperation();

    if (!converter.amount.value) {
        converter.result.innerHTML = "Preencha a quantia";
    } else if (resultValue === false) {
        converter.result.innerHTML = "Preencha corretamente";
    } else {
        if (converter.toCurrency.value === "USD") {
            converter.result.innerHTML =
                converter.currencyFormatter("USD", "en-US").format(resultValue);
        } else if (converter.toCurrency.value === "BRL") {
            converter.result.innerHTML =
                converter.currencyFormatter("BRL", "pt-br").format(resultValue);
        } else if (converter.toCurrency.value === "EUR") {
            converter.result.innerHTML =
                converter.currencyFormatter("EUR", "en-GB").format(resultValue);
        }
    }

    converter.amount.value = "";
}

function switchCurrency() {
	const aux = converter.fromCurrency.value;
    converter.fromCurrency.value = converter.toCurrency.value;
    converter.toCurrency.value = aux;
}