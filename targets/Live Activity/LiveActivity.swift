import ActivityKit
import SwiftUI
import WidgetKit

struct ActivityView: View {
    let context: ActivityViewContext<Attributes>
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack {
            VStack(spacing: 10) {
                HStack {
                    Image(colorScheme == .dark ? "IconWhite" : "Icon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 32, height: 32)
                    Text(context.state.headline)
                        .font(.headline)
                    Spacer()
                }
                .padding(.top)

                HStack {
                    Text(context.state.title)
                        .font(.title2)
                        .padding(.top, 5)
                    Spacer()
                }

                Spacer()

                ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: false)
                    .progressViewStyle(LinearProgressViewStyle())

                Spacer()
            }
            .padding(.horizontal)

            Image("SmallListing")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .cornerRadius(10)
                .frame(width: 100)
                .padding()
        }
    }
}

struct IslandBottom: View {
    let context: ActivityViewContext<Attributes>

    var body: some View {
        VStack {
            HStack {
                VStack(spacing: 10) {
                    Spacer()

                    Text(context.state.title)
                        .font(.title3)

                    ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: false)
                        .progressViewStyle(LinearProgressViewStyle())

                    Spacer()
                }
                .padding(.horizontal)

                Image("SmallListing")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .cornerRadius(10)
                    .frame(width: 100)
            }
        }
    }
}

struct Widget: Widget {
    let kind: String = "_Widget"

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: Attributes.self) { context in
            ActivityView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Image("IconWhite")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 36)
                        .padding(.leading)
                }
                DynamicIslandExpandedRegion(.trailing) {}
                DynamicIslandExpandedRegion(.bottom) {
                    IslandBottom(context: context)
                }
            } compactLeading: {
                Image("IconWhite")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 16)
            } compactTrailing: {} minimal: {
                Image("IconWhite")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 16)
            }
            .widgetURL(URL(string: context.state.widgetUrl))
        }
    }
}

private extension Attributes {
    static var preview: Attributes {
        Attributes()
    }
}

private extension Attributes.ContentState {
    static var state: Attributes.ContentState {
        Attributes.ContentState(startTime: Date(timeIntervalSince1970: TimeInterval(1704300710)), endTime: Date(timeIntervalSince1970: TimeInterval(1704304310)), title: "Started at 11:54AM", headline: " in Progress", widgetUrl: "https://www.apple.com")
    }
}

struct ActivityView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .content)
                .previewDisplayName("Content View")

            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .dynamicIsland(.compact))
                .previewDisplayName("Dynamic Island Compact")

            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .dynamicIsland(.expanded))
                .previewDisplayName("Dynamic Island Expanded")

            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .dynamicIsland(.minimal))
                .previewDisplayName("Dynamic Island Minimal")
        }
    }
}
