"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedContainer } from "@/components/animated-container"

interface ProductDescriptionProps {
  description: string
  ingredients?: string
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
  }
  allergens?: string[]
  storageInstructions?: string
}

export function ProductDescription({
  description,
  ingredients,
  nutritionalInfo,
  allergens,
  storageInstructions,
}: ProductDescriptionProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
      <Tabs defaultValue="description" onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
          >
            {t("description")}
          </TabsTrigger>
          {ingredients && (
            <TabsTrigger
              value="ingredients"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
            >
              {t("ingredients")}
            </TabsTrigger>
          )}
          {nutritionalInfo && (
            <TabsTrigger
              value="nutrition"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
            >
              {t("nutrition")}
            </TabsTrigger>
          )}
          {storageInstructions && (
            <TabsTrigger
              value="storage"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
            >
              {t("storage")}
            </TabsTrigger>
          )}
        </TabsList>

        <AnimatedContainer animation="fadeIn" duration={0.3} key={activeTab}>
          <TabsContent value="description" className="mt-0">
            <div className="prose max-w-none dark:prose-invert">
              <p>{description}</p>
            </div>
          </TabsContent>

          {ingredients && (
            <TabsContent value="ingredients" className="mt-0">
              <div className="prose max-w-none dark:prose-invert">
                <p>{ingredients}</p>

                {allergens && allergens.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                      {t("allergens")}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {nutritionalInfo && (
            <TabsContent value="nutrition" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {nutritionalInfo.calories !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("calories")}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {nutritionalInfo.calories} kcal
                    </div>
                  </div>
                )}

                {nutritionalInfo.protein !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("protein")}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {nutritionalInfo.protein}g
                    </div>
                  </div>
                )}

                {nutritionalInfo.carbs !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("carbs")}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{nutritionalInfo.carbs}g</div>
                  </div>
                )}

                {nutritionalInfo.fat !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("fat")}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{nutritionalInfo.fat}g</div>
                  </div>
                )}

                {nutritionalInfo.fiber !== undefined && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("fiber")}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{nutritionalInfo.fiber}g</div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {storageInstructions && (
            <TabsContent value="storage" className="mt-0">
              <div className="prose max-w-none dark:prose-invert">
                <p>{storageInstructions}</p>
              </div>
            </TabsContent>
          )}
        </AnimatedContainer>
      </Tabs>
    </div>
  )
}
