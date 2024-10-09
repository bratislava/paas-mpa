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
            let startTime = Date(timeIntervalSince1970: TimeInterval(startTimeUnix) / 1000)
            let endTime = Date(timeIntervalSince1970: TimeInterval(endTimeUnix) / 1000)
            
            if #available(iOS 16.2, *) {
                let attributes = Attributes()
                let contentState = Attributes.ContentState(startTime: startTime, endTime: endTime, licencePlate: licencePlate, parkingLocation: parkingLocation, widgetUrl: widgetUrl)
                
                let activityContent = ActivityContent(state: contentState, staleDate: endTime)
                
                do {
                    let activity = try Activity.request(attributes: attributes, content: activityContent)
                    log.info("started: \(activity.id)")
                    return activity.id
                } catch (let error) {
                    log.info("error: \(error.localizedDescription)")
                    return nil
                }
            } else {
                return nil
            }
        }      

        Function("updateActivity") { (id: String, startTimeUnix: UInt64, endTimeUnix: UInt64, licencePlate: String, parkingLocation: String, widgetUrl: String) -> String? in
            let startTime = Date(timeIntervalSince1970: TimeInterval(startTimeUnix) / 1000)
            let endTime = Date(timeIntervalSince1970: TimeInterval(endTimeUnix) / 1000)
            
            if #available(iOS 16.2, *) {
                let attributes = Attributes()                

                let contentState = Attributes.ContentState(startTime: startTime, endTime: endTime, licencePlate: licencePlate, parkingLocation: parkingLocation, widgetUrl: widgetUrl)
                let updatedContent = ActivityContent(state: contentState, staleDate: endTime)
                
                Task {
                    for activity in Activity<Attributes>.activities {
                        if activity.id == id {
                            do {
                                await activity.update(updatedContent)
                                log.info("Successfully updated activity with ID: \(id)")
                            } catch {
                                log.info("Failed to update activity: \(error.localizedDescription)")
                            }
                            break
                        }
                    }
                }

                return nil
            } else {
                return nil
            }
        }      
          
        Function("endActivity") { (id: String) -> String? in
            if #available(iOS 16.2, *) {
                let attributes = Attributes()
                let contentState = Attributes.ContentState(startTime: .now, endTime: .now, licencePlate: "", parkingLocation: "", widgetUrl: "")
                let finalContent = ActivityContent(state: contentState, staleDate: .now)
                
                Task {
                    for activity in Activity<Attributes>.activities {
                        if activity.id == id {
                            do {
                                await activity.end(finalContent, dismissalPolicy: .immediate)
                                log.info("Successfully ended activity with ID: \(id)")
                            } catch {
                                log.info("Failed to end activity: \(error.localizedDescription)")
                            }
                            break
                        }
                    }
                }
                
                return id
            } else {
                return nil
            }
        }

        Function("endAllActivities") { () -> Void in
            if #available(iOS 16.2, *) {
                Task {
                    for activity in Activity<Attributes>.activities {
                        let contentState = Attributes.ContentState(startTime: .now, endTime: .now, licencePlate: "", parkingLocation: "", widgetUrl: "")
                        let finalContent = ActivityContent(state: contentState, staleDate: nil)
                        log.info("ended: \(activity.id)")
                        await activity.end(finalContent, dismissalPolicy: .immediate)
                    }
                }
            }
        }
    }
}
