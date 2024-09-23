import ExpoModulesCore
import ActivityKit

public class LiveActivityControlModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivityControlModule")
        
        Function("areActivitiesEnabled") { () -> Bool in
            if #available(iOS 16.2, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            } else {
                return false
            }
        }
        
        Function("startActivity") { (startTimeUnix: UInt64, endTimeUnix: UInt64, licencePlate: String, parkingLocation: String, widgetUrl: String) -> String? in
            let startTime =  Date(timeIntervalSince1970: TimeInterval(startTimeUnix) / 1000)
            let endTime =  Date(timeIntervalSince1970: TimeInterval(endTimeUnix) / 1000)
            
            if #available(iOS 16.2, *) {
                let attributes = Attributes()
                let contentState = Attributes.ContentState(startTime: startTime, endTime: endTime, licencePlate: licencePlate, parkingLocation: parkingLocation, widgetUrl: widgetUrl)
                
                let activityContent = ActivityContent(state: contentState, staleDate: endTime)
                
                do {
                    let activity = try Activity.request(attributes: attributes, content: activityContent)
                    return activity.id
                } catch (let error) {
                    log.info("errorr: \(error.localizedDescription)")

                    return  nil
                }
            } else {
                return  nil
            }
        }       

        Function("endActivity") { (licencePlate: String, parkingLocation: String, widgetUrl: String) -> Void in
            if #available(iOS 16.2, *) {
                let contentState = Attributes.ContentState(startTime: .now, endTime: .now, licencePlate: licencePlate, parkingLocation: parkingLocation, widgetUrl: widgetUrl)
                let finalContent = ActivityContent(state: contentState, staleDate: nil)
                
                Task {
                    for activity in Activity<Attributes>.activities {
                        await activity.end(finalContent, dismissalPolicy: .immediate)
                    }
                }
            }
        }
    }
}
