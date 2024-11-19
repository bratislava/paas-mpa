import ActivityKit
import SwiftUI

struct Attributes: ActivityAttributes {
    public typealias Status = ContentState
    
    public struct ContentState: Codable, Hashable {
        var startTime: Date
        var endTime: Date
        var licencePlate: String
        var parkingLocation: String
        var locale: String
    }
}
