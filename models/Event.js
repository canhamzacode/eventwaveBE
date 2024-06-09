const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    eventType: {
      type: String,
      enum: ['virtual', 'physical'],
      required: true
    },
    eventName: {
      type: String,
      required: true
    },
    eventImage: {
      type: String,
      required: true
    },
    eventDescription: {
      type: String,
      required: true
    },
    eventStartDate: {
      type: Date,
      required: true
    },
    eventEndDate: {
      type: Date,
      required: true
    },
    eventStartTime: {
      type: Date,
      required: true
    },
    eventEndTime: {
      type: Date,
      required: true
    },
    eventTags: {
      type: [String],
      required: true
    },
    eventLocation: {
      type: String,
      required: true
    },
    paidEvent: {
      type: Boolean,
      required: true
    },
    ticketPrice: {
      type: Number,
      required: function () {
        return this.paidEvent;
      }
    },
    availableTickets: {
      type: Number,
      required: true
    },
    registrationCloseDate: {
      type: Date,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
