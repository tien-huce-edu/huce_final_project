import cloudinary from "cloudinary"
import { Request, Response, NextFunction } from "express"
import ErrorHandler from "../utils/ErrorHandler"
import { catchAsyncError } from "../middleware/catchAsyncErrors"
import LayoutModel from "../models/layout.model"

// create layout

export const createLayout = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.body
            const isTypeExist = await LayoutModel.findOne({ type })
            if (isTypeExist) return next(new ErrorHandler("Layout already exist", 400))

            if (type === "Banner") {
                const { image, title, subTitle } = req.body
                console.log(title, subTitle)
                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout"
                })
                const banner = {
                    type: "Banner",
                    banner: {
                        image: {
                            public_id: myCloud.public_id,
                            url: myCloud.secure_url
                        },
                        title,
                        subTitle
                    }
                }
                await LayoutModel.create(banner)
            }
            if (type === "FAQ") {
                const { faq } = req.body
                const faqItems = await Promise.all(
                    faq.map(async (item: any) => {
                        return {
                            question: item.question,
                            answer: item.answer
                        }
                    })
                )
                await LayoutModel.create({ type: "FAQ", faq: faqItems })
            }
            if (type === "Category") {
                const { categories } = req.body
                const categoriesItems = await Promise.all(
                    categories.map(async (item: any) => {
                        return {
                            title: item.title
                        }
                    })
                )
                await LayoutModel.create({ type: "Category", categories: categoriesItems })
            }

            res.status(200).json({
                success: true,
                message: "Layout created successfully"
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// edit layout

export const editLayout = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.body
            if (type === "Banner") {
                const bannerData: any = await LayoutModel.findOne({ type: "Banner" })

                const { image, title, subTitle } = req.body

                const data = image.startsWith("https")
                    ? bannerData
                    : await cloudinary.v2.uploader.upload(image, {
                          folder: "layout"
                      })

                const banner = {
                    type: "Banner",
                    image: {
                        public_id: image.startsWith("https")
                            ? bannerData.banner.image.public_id
                            : data?.public_id,
                        url: image.startsWith("https")
                            ? bannerData.banner.image.url
                            : data?.secure_url
                    },
                    title,
                    subTitle
                }

                await LayoutModel.findByIdAndUpdate(bannerData._id, { banner })
            }

            if (type === "FAQ") {
                const { faq } = req.body
                const FaqItem = await LayoutModel.findOne({ type: "FAQ" })
                const faqItems = await Promise.all(
                    faq.map(async (item: any) => {
                        return {
                            question: item.question,
                            answer: item.answer
                        }
                    })
                )
                await LayoutModel.findByIdAndUpdate(FaqItem?._id, { type: "FAQ", faq: faqItems })
            }
            if (type === "Category") {
                const { categories } = req.body
                const CategoriesItem = await LayoutModel.findOne({ type: "Category" })

                const categoriesItems = await Promise.all(
                    categories.map(async (item: any) => {
                        return {
                            title: item.title
                        }
                    })
                )
                await LayoutModel.findByIdAndUpdate(CategoriesItem?._id, {
                    type: "Category",
                    categories: categoriesItems
                })
            }

            res.status(200).json({
                success: true,
                message: "Layout update successfully"
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

// get layout by type

export const getLayoutByType = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const type = req.params.type || req.body.type
            const layout = await LayoutModel.findOne({ type })
            if (!layout) return next(new ErrorHandler("Layout not found", 404))

            res.status(201).json({
                success: true,
                layout
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)
