import Testing
import Foundation
@testable import RecipeBook

private struct FakeService: RecipeService {
    var result: Result<[Recipe], Error>
    func search(_ text: String) async throws -> [Recipe] { try result.get() }
}

private struct Boom: Error {}

@MainActor
struct RecipeTests {
    private let sample = Recipe(id: "1", name: "Pasta", category: "Pasta", area: "Italian",
                                instructions: "Boil.", thumbnail: nil)

    @Test func decodesTheServiceJSON() throws {
        let json = """
        {"meals":[{"idMeal":"52772","strMeal":"Teriyaki Chicken","strCategory":"Chicken","strArea":"Japanese","strInstructions":"Cook.","strMealThumb":"https://example.com/a.jpg"}]}
        """
        let decoded = try JSONDecoder().decode(RecipeResponse.self, from: Data(json.utf8))
        #expect(decoded.meals?.first?.name == "Teriyaki Chicken")
    }

    @Test func nullMealsDecodesToNil() throws {
        let decoded = try JSONDecoder().decode(RecipeResponse.self, from: Data(#"{"meals":null}"#.utf8))
        #expect(decoded.meals == nil)
    }

    @Test func successShowsRecipes() async {
        let model = RecipeViewModel(service: FakeService(result: .success([sample])))
        await model.load("pasta")
        #expect(model.state == .loaded([sample]))
    }

    @Test func failureShowsMessage() async {
        let model = RecipeViewModel(service: FakeService(result: .failure(Boom())))
        await model.load("pasta")
        if case .failed = model.state {
            #expect(Bool(true))
        } else {
            Issue.record("Expected the failed state")
        }
    }
}
