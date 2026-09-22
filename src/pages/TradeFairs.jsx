import { useState } from "react";
import states from "./states_urls";
import "./TradeFairs.css";
function TradeFairs() {

    const [state, setState] = useState("");
    const [ministry, setMinistry] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");

    const ministries = [
        "MINISTRY OF AGRICULTURE",
        "MINISTRY OF COMMERCE",
        "MINISTRY OF CONSUMER & PDS",
        "MINISTRY OF MSME",
        "MINISTRY OF CO-OPERATIVE",
        "MINISTRY OF AAYUSH",
        "MINISTRY OF SHIPPING",
        "MINISTRY OF CHEMICALS & FERTILIZERS",
        "MINISTRY OF FOREST",
        "MINISTRY OF HEALTH & FAMILY WELFARE",
        "MINISTRY OF WOMEN & CHILD DEVELOPMENT",
        "MINISTRY OF DEFENCE",
        "MINISTRY OF TEXTILE",
        "MINISTRY OF FINANCE",
        "MINISTRY OF HRD",
        "MINISTRY OF SKILL DEVELOPMENT",
        "MINISTRY OF RAILWAYS",
        "MINISTRY OF FOOD PROCESSING",
        "MINISTRY OF CIVIL AVIATION",
        "MINISTRY OF ANIMAL HUSBANDRY",
        "MINISTRY OF EXTERNAL AFFAIRS"
    ];

    const years = [
        "2026",
        "2027",
        "2028",
        "2029",
        "2030"
    ];

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    function handleViewFairs() {

        if (
            state === "" ||
            ministry === "" ||
            year === "" ||
            month === ""
        ) {
            alert("Please select State, Ministry, Year and Month.");
            return;
        }


        const selectedState = states.find(function (item) {
            return item.state === state;
        });


        if (selectedState) {

            window.open(
                selectedState.url,
                "_blank"
            );

        } else {

            alert("Trade fair URL not available for this state.");

        }
    }


    function handleInternational() {

        window.open(
            "https://apeda.gov.in/TradeFairs",
            "_blank"
        );

    }


    return (

        <div className="trade-page">


            {/* Decorative greenery */}

            <div className="leaf leaf-one">
                🌿
            </div>

            <div className="leaf leaf-two">
                🍃
            </div>

            <div className="leaf leaf-three">
                🌱
            </div>

            <div className="leaf leaf-four">
                🌿
            </div>


            {/* Header */}

            <header className="trade-header">

                <div className="brand-section">

                    <div className="brand-icon">
                        🌾
                    </div>

                    <div>

                        <h1>
                            Agri Trade Fairs
                        </h1>

                        <p>
                            Discover • Connect • Grow
                        </p>

                    </div>

                </div>


                <div className="header-leaves">
                    🌿 🌱 🍃
                </div>

            </header>


            {/* Main Content */}

            <main className="trade-container">


                {/* Title */}

                <section className="hero-section">

                    <div className="hero-icon">
                        🌾
                    </div>

                    <h2>
                        Explore Trade Fairs
                    </h2>

                    <p>
                        Find agricultural and business trade fairs
                        across India and international markets.
                    </p>

                </section>



                {/* Domestic / International */}

                <section className="type-section">

                    <button
                        className="type-button active"
                    >

                        <span>
                            🇮🇳
                        </span>

                        India Domestic

                    </button>


                    <button
                        className="type-button"
                        onClick={handleInternational}
                    >

                        <span>
                            🌍
                        </span>

                        International

                    </button>

                </section>



                {/* Filter Card */}

                <section className="filter-card">


                    <div className="card-heading">

                        <div className="heading-icon">
                            🌱
                        </div>


                        <div>

                            <h3>
                                Find Domestic Trade Fairs
                            </h3>

                            <p>
                                Select the required details to
                                explore trade fairs.
                            </p>

                        </div>

                    </div>



                    {/* Filters */}

                    <div className="filters-grid">


                        {/* State */}

                        <div className="filter-group">

                            <label>
                                State
                            </label>

                            <select
                                value={state}
                                onChange={function (event) {
                                    setState(event.target.value);
                                }}
                            >

                                <option value="">
                                    Select State
                                </option>


                                {states.map(function (item, index) {

                                    return (

                                        <option
                                            key={index}
                                            value={item.state}
                                        >
                                            {item.state}
                                        </option>

                                    );

                                })}

                            </select>

                        </div>



                        {/* Ministry */}

                        <div className="filter-group">

                            <label>
                                Ministry / Department
                            </label>

                            <select
                                value={ministry}
                                onChange={function (event) {
                                    setMinistry(event.target.value);
                                }}
                            >

                                <option value="">
                                    Select Ministry / Department
                                </option>


                                {ministries.map(function (item, index) {

                                    return (

                                        <option
                                            key={index}
                                            value={item}
                                        >
                                            {item}
                                        </option>

                                    );

                                })}

                            </select>

                        </div>



                        {/* Year */}

                        <div className="filter-group">

                            <label>
                                Year
                            </label>

                            <select
                                value={year}
                                onChange={function (event) {
                                    setYear(event.target.value);
                                }}
                            >

                                <option value="">
                                    Select Year
                                </option>


                                {years.map(function (item, index) {

                                    return (

                                        <option
                                            key={index}
                                            value={item}
                                        >
                                            {item}
                                        </option>

                                    );

                                })}

                            </select>

                        </div>



                        {/* Month */}

                        <div className="filter-group">

                            <label>
                                Month
                            </label>

                            <select
                                value={month}
                                onChange={function (event) {
                                    setMonth(event.target.value);
                                }}
                            >

                                <option value="">
                                    Select Month
                                </option>


                                {months.map(function (item, index) {

                                    return (

                                        <option
                                            key={index}
                                            value={item}
                                        >
                                            {item}
                                        </option>

                                    );

                                })}

                            </select>

                        </div>

                    </div>



                    {/* View Button */}

                    <button
                        className="view-button"
                        onClick={handleViewFairs}
                    >

                        <span>
                            🔎
                        </span>

                        View Trade Fairs

                        <span>
                            →
                        </span>

                    </button>



                    {/* Small information */}

                    <div className="info-box">

                        <span className="info-icon">
                            ℹ️
                        </span>

                        <p>
                            Select a state to view the available
                            trade fairs for that location.
                        </p>

                    </div>


                </section>

            </main>



            {/* Footer */}

            <footer className="trade-footer">

                <span>
                    🌱
                </span>

                <p>
                    Connecting Farmers, Businesses & Opportunities
                </p>

                <span>
                    🌾
                </span>

            </footer>


        </div>
    );
}

export default TradeFairs;