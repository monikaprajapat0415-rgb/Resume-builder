import Foundation

enum RecipeError: LocalizedError {
    case badURL
    case badStatus(Int)

    var errorDescription: String? {
        switch self {
        case .badURL: return "The search address is not valid."
        case .badStatus(let code): return "The server answered with error \(code)."
        }
    }
}

protocol RecipeService {
    func search(_ text: String) async throws -> [Recipe]
}

struct MealDBService: RecipeService {
    func search(_ text: String) async throws -> [Recipe] {
        guard var parts = URLComponents(string: "https://www.themealdb.com/api/json/v1/1/search.php") else {
            throw RecipeError.badURL
        }
        parts.queryItems = [URLQueryItem(name: "s", value: text)]
        guard let url = parts.url else { throw RecipeError.badURL }

        let (data, response) = try await URLSession.shared.data(from: url)
        if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
            throw RecipeError.badStatus(http.statusCode)
        }
        return try JSONDecoder().decode(RecipeResponse.self, from: data).meals ?? []
    }
}
