import imageURL from "@/assets/shrovetide-2024.jpg"
import { Modal } from "@/shared/ui/modal"
import { useState } from "react"

export const Shrovetide2024 = () => {
    const [isModalOpened, setIsModalOpened] = useState(false)

    return (
        <>
            <div
                className="flex flex-col justify-between h-32 justify-end bg-surface rounded-2xl p-3 cursor-pointer"
                onClick={() => setIsModalOpened(true)}
                style={{
                    background: [
                        "linear-gradient(rgb(var(--surface-color) / 0.95), rgb(var(--surface-color) / 0.95))",
                        `url(${imageURL}) no-repeat center center/cover`,
                    ].join(","),
                }}
            >
                <div className="flex justify-end text-sm opacity-90">12:30 – 13:45</div>
                <div className="flex flex-col gap-1">
                    <p className="font-medium text-xl">Масленица</p>
                    <p>Ждём вас на втором этаже!</p>
                </div>
            </div>
            <Modal.Wrapper isOpened={isModalOpened} onClose={() => setIsModalOpened(false)}>
                <Modal.Body>
                    <Modal.Title title="Масленица" />

                    <div className="flex flex-col gap-3">
                        <p>
                            Ждём вас <b>14 марта с 12:30 до 13:45</b> на втором этаже института
                        </p>

                        <h3 className="text-lg font-medium">Меню</h3>

                        <table className="bg-primary -mx-4 [&>tr>*]:px-4 [&>tr>*]:py-2.5 rounded-2xl">
                            <tr>
                                <th className="text-left">Блины</th>
                                <th className="w-[120px] text-left"></th>
                            </tr>
                            <tr>
                                <td>Классический блин</td>
                                <td>25 рублей</td>
                            </tr>
                            <tr>
                                <td>Шоколадный блин</td>
                                <td>30 рублей</td>
                            </tr>
                            <tr>
                                <td>Овсяный блин</td>
                                <td>25 рублей</td>
                            </tr>
                            <tr>
                                <td>Гречневый блин</td>
                                <td>30 рублей</td>
                            </tr>
                            <tr>
                                <td>Черёмуховый блин</td>
                                <td>35 рублей</td>
                            </tr>
                            <tr>
                                <td>Блин с&nbsp;карамелизированным бананом</td>
                                <td>40 рублей</td>
                            </tr>
                            <tr>
                                <td>Блин с&nbsp;ветчиной и сыром</td>
                                <td>50 рублей</td>
                            </tr>
                            <tr>
                                <td>Блин с&nbsp;фаршем</td>
                                <td>60 рублей</td>
                            </tr>
                            <tr>
                                <td>Блин с&nbsp;творогом</td>
                                <td>45 рублей</td>
                            </tr>
                            <tr>
                                <td>Блин с&nbsp;лососем, тв. сыром и&nbsp;огурцом</td>
                                <td>150 рублей</td>
                            </tr>
                            <tr>
                                <td>Блин с&nbsp;луком и грибами</td>
                                <td>50 рублей</td>
                            </tr>
                            <tr>
                                <td>Кондименты</td>
                                <td>20 рублей</td>
                            </tr>
                            <tr>
                                <th className="text-left">Напитки</th>
                                <th className="w-[120px] text-left"></th>
                            </tr>
                            <tr>
                                <td>Какао</td>
                                <td>50 рублей</td>
                            </tr>
                            <tr>
                                <td>Вишнёвый компот</td>
                                <td>50 рублей</td>
                            </tr>
                            <tr>
                                <td>Банановый коктейль</td>
                                <td>80 рублей</td>
                            </tr>
                            <tr>
                                <td>Чёрный чай с&nbsp;кардамоном и&nbsp;гвоздикой</td>
                                <td>50 рублей</td>
                            </tr>
                            <tr>
                                <td>Зелёный чай с&nbsp;лавандой</td>
                                <td>50 рублей</td>
                            </tr>
                        </table>
                    </div>
                </Modal.Body>
            </Modal.Wrapper>
        </>
    )
}
