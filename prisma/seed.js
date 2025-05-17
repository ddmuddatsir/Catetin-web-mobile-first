"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _i, categories_1, category, foodCategory, transportCategory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    categories = [
                        { name: "Makanan", icon: "🍔" },
                        { name: "Transportasi", icon: "🚗" },
                        { name: "Belanja", icon: "🛍️" },
                        { name: "Hiburan", icon: "🎬" },
                        { name: "Kesehatan", icon: "💊" },
                        { name: "Edukasi", icon: "📚" },
                        { name: "Lainnya", icon: "⚡" },
                        { name: "Gaji", icon: "💰" },
                    ];
                    _i = 0, categories_1 = categories;
                    _a.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 4];
                    category = categories_1[_i];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { name: category.name }, // Use 'name' as unique identifier
                            update: {}, // If exists, do nothing
                            create: category, // Otherwise, create the category
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, prisma.category.findFirst({
                        where: { name: "Makanan" }, // 'findFirst' works with any field
                    })];
                case 5:
                    foodCategory = _a.sent();
                    return [4 /*yield*/, prisma.category.findFirst({
                            where: { name: "Transportasi" },
                        })];
                case 6:
                    transportCategory = _a.sent();
                    if (!foodCategory) return [3 /*break*/, 8];
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                amount: 10000,
                                description: "Lunch at restaurant",
                                date: new Date(),
                                categoryId: foodCategory.id,
                            },
                        })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    if (!transportCategory) return [3 /*break*/, 10];
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                amount: 20000,
                                description: "Fuel for car",
                                date: new Date(),
                                categoryId: transportCategory.id,
                            },
                        })];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
