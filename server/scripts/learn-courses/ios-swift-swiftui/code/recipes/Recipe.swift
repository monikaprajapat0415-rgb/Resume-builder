import Foundation

struct Recipe: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let category: String?
    let area: String?
    let instructions: String?
    let thumbnail: URL?

    enum CodingKeys: String, CodingKey {
        case id = "idMeal"
        case name = "strMeal"
        case category = "strCategory"
        case area = "strArea"
        case instructions = "strInstructions"
        case thumbnail = "strMealThumb"
    }
}

// The service answers {"meals": [...]} and uses null, not an empty list, when nothing matches.
struct RecipeResponse: Codable {
    let meals: [Recipe]?
}
