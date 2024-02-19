import L18n from '../l18n/L18n';

type Type = {
	categoryId: number;
	defaultCost: number;
	defaultDuration: number;
	defaultRepeatInterval: number;
	descCode: string;
	nameCode: string;
	id: number;
};

type Category = {
	id: number;
	parent: number;
	code: string;
};

type EventTypeDef = {
	categories: Category[];
	translation: object;
};

function findCategory(id: number, cats: Category[]): undefined | Category {
	if (id === 0 || cats === undefined || cats.length === 0) return undefined;
	return cats.find((c) => c.id === id);
}

function findSubtypes(category_id: number, cats: Category[], l18n: L18n): undefined | {} {
	console.log(category_id);
	console.log(cats);
	if (category_id === 0 || cats === undefined || cats.length === 0) return undefined;

	return cats
		.filter((c) => c.parent === category_id)
		.map((c) => {
			console.log(c);

			return {
				id: c.id,
				name: l18n.findByCode(c.code) 
			};
		});

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
		return [l18n.findByCode(cat.code)];
	}

	return [
		...categorize(cat?.parent || 0, categories, l18n, false),
		l18n.findByCode(cat.code),
	];
}

export default function EventType({ categories, translation }: EventTypeDef) {
	const tr = new L18n(translation);

	const getCategories = (type: Type) =>
		categorize(type.categoryId, categories, tr, false);
	const getName = (type: Type) =>
		tr.findByCode(type.nameCode);

	const getSubtypes = (category_id: number) =>
		findSubtypes(category_id, categories, tr);

	return {
		getCategories,
		getSubtypes,
		getName,
		getDescription: (type: Type) =>
			tr.findByCode(type.descCode),
		getCategory: (cat: Category) => tr.findByCode(cat.code),
		getFullName: (type: Type) =>
			[...getCategories(type), getName(type)].join(' / '),
	};
}
