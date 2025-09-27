import joi from 'joi';

export const transformSchema = joi.object({
    resize: joi.object({
        width: joi.number(),
        height: joi.number()
    }),
    "crop": joi.object({
        x: joi.number(),
        y: joi.number(),
        width: joi.number(),
        height: joi.number()
    }),
    "rotate":joi.number(),
    "format": joi.string(),
    "filters": joi.object({
        grayscale: joi.boolean(),
        sepia: joi.boolean()
    })
});