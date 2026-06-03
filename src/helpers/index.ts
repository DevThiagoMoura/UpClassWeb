import { dateFormat } from './date.helper';
import { moneyFormat } from './money.helper'; // <- novo helper
import { type Application } from 'express';
import {
    type ValidationErrorsViewModel,
    validationErrorsHelper,
} from 'nest-validation-view';

type ViewHelpers = {
    dateFormat: typeof dateFormat;
    moneyFormat: typeof moneyFormat;
    validationErrors: (
        errors: ValidationErrorsViewModel | null | undefined,
    ) => ValidationErrorsViewModel;
};

export const registerHelpers = (app: Application): void => {
    const helpers: ViewHelpers = {
        dateFormat,
        moneyFormat,
        validationErrors: validationErrorsHelper,
    };

    Object.assign(app.locals, helpers);
};