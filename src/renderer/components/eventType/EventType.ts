import L18n from '../l18n/L18n';

type Type = {
	categoryId: number;
	defaultCost: number;
	defaultDuration: number;
	defaultRepeatInterval: number;
	i18nEventTypeDescription: number;
	i18nEventTypeName: number;
	id: number;
};

type Category = {
	id: number;
	parent: number;
	i18nEventTypeCategoryName: number;
};

type Translation = {
	[index: number | string]: {
		id: number;
		values: string[];
	};
};

type EventTypeDef = {
	categories: Category[];
	translation: Translation;
};

const i18nEventTypeCategoryName = 'i18nEventTypeCategoryName';
const i18nEventTypeName = 'i18nEventTypeName';
const i18nEventTypeDescription = 'i18nEventTypeDescription';

function findCategory(id: number, cats: Category[]): undefined | Category {
	if (id === 0 || cats === undefined || cats.length === 0) return undefined;
	return cats.find((c) => c.id === id);
}

function findCategoryName(cat: Category, l18n: L18n): string {
	return cat
		? `${l18n.findTranslationById(cat, i18nEventTypeCategoryName)}`
		: '';
}

function categorize(
	id: number,
	categories: Category[],
	l18n: L18n,
	stop: boolean,
): string[] {
	const cat = findCategory(id, categories);
	if (cat === undefined) return [];

	if (stop) {
		return [findCategoryName(cat, l18n)];
	}

	return [
		...categorize(cat?.parent || 0, categories, l18n, false),
		findCategoryName(cat, l18n),
	];
}

export default function EventType({ categories, translation }: EventTypeDef) {
	const tr = new L18n(translation);

	const getCategories = (type: Type) =>
		categorize(type.categoryId, categories, tr, false);
	const getName = (type: Type) =>
		tr.findTranslationById(type, i18nEventTypeName);

	return {
		getCategories,
		getName,
		getDescription: (type: Type) =>
			tr.findTranslationById(type, i18nEventTypeDescription),
		getCategory: (cat: Category) => findCategoryName(cat, tr),
		getFullName: (type: Type) =>
			[...getCategories(type), getName(type)].join(' / '),
	};
}
