import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dict = {
    Переговоры: "bg-orange-200",
    "Первичный контакт": "bg-red-200",
    "Принимают решение": "bg-teal-200",
    "Согласование договора": "bg-green-200",
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/leads/all")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="main-block w-4/5 bg-white h-5/6 rounded-3xl p-10">
      {isLoading
        ? "Loading..."
        : data.map((lead) => {
            const { name, price, status_name, resp_name, client_name } = lead;
            return (
              <div className="inner-block w-60 border-2 border-black rounded-3xl pt-5 pl-5 pb-5">
                <h3 className="card-title font-bold text-xl ">{name}</h3>
                <p className="font-bold text-lg  mb-0 mt-2">Бюджет:</p>
                <p className="text-lg mt-0 font-medium">{price}</p>
                <p
                  className={`text-lg mt-0 font-medium ${dict[status_name]} pt-2 pb-2 text-center max-w-36 rounded-xl mt-3 mb-3`}
                >
                  {status_name == "Первичный контакт"
                    ? "Контакт"
                    : status_name == "Принимают решение"
                    ? "Думают"
                    : status_name == "Согласование договора"
                    ? "Договор"
                    : status_name}
                </p>
                <p className="font-bold text-lg  mb-0 mt-2">Менеджер:</p>
                <p className="text-lg mt-0 font-medium">{resp_name}</p>
                <p className="font-bold text-lg  mb-0 mt-2">Клиент:</p>
                <p className="text-lg mt-0 font-medium">{client_name}</p>
              </div>
            );
          })}
    </div>
  );
}

export default App;
