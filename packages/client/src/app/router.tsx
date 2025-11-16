import { BellsPage } from "@/pages/bells"
import { HomePage } from "@/pages/home"
import { OnboardingPage } from "@/pages/onboarding"
import { SettingsPage } from "@/pages/settings"
import { Sorry } from "@/pages/sorry"
import { StatisticsPage } from "@/pages/statistics"
import { Route, Routes } from "react-router-dom"

export const Router = () => (
    <Routes>
        <Route path={"/"}>
            <Route path={"/"} Component={HomePage} />
            <Route path={"/onboarding"} Component={OnboardingPage} />
            <Route path={"/settings"} Component={SettingsPage} />
            <Route path={"/statistics"} Component={StatisticsPage} />
            <Route path={"/bells"} Component={BellsPage} />
            <Route path={"/sorry"} Component={Sorry} />
        </Route>
    </Routes>
)
