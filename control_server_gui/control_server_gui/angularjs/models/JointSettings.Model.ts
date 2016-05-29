class JointSettingsModel
{
    joint_handle: string = "left_shoulder_pitch";

    joint_settings = {
        "left_shoulder_pitch": {
            "name": "Left Shoulder Pitch",
            "value": 0
        },
        "left_thigh_yaw": {
            "name": "Left Thigh Yaw",
            "value": 0
        },
        "left_shoulder_roll": {
            "name": "Left Shoulder Roll",
            "value": 0
        },
        "left_elbow_roll": {
            "name": "Left Elbow Roll",
            "value": 0
        },
        "left_thigh_roll": {
            "name": "Left Thigh Roll",
            "value": 0
        },
        "left_thigh_pitch": {
            "name": "Left Thigh Pitch",
            "value": 0
        },
        "left_knee_pitch": {
            "name": "Left Knee Pitch",
            "value": 0
        },
        "left_foot_pitch": {
            "name": "Left Foot Pitch",
            "value": 0
        },
        "left_foot_roll": {
            "name": "Left Foot Roll",
            "value": 0
        },
        "right_shoulder_pitch": {
            "name": "Right Shoulder Pitch",
            "value": 0
        },
        "right_thigh_yaw": {
            "name": "Right Thigh Yaw",
            "value": 0
        },
        "right_shoulder_roll": {
            "name": "Right Shoulder Roll",
            "value": 0
        },
        "right_elbow_roll": {
            "name": "Right Elbow Roll",
            "value": 0
        },
        "right_thigh_roll": {
            "name": "Right Thigh Roll",
            "value": 0
        },
        "right_thigh_pitch": {
            "name": "Right Thigh Pitch",
            "value": 0
        },
        "right_knee_pitch": {
            "name": "Right Knee Pitch",
            "value": 0
        },
        "right_foot_pitch": {
            "name": "Right Foot Pitch",
            "value": 0
        },
        "right_foot_roll": {
            "name": "Right Foot Roll",
            "value": 0
        }
    };

    static $inject = [
        // none
    ];

    constructor()
    {
        // noop.
    }

    setValue(value: number): void
    {
        this.joint_settings[this.joint_handle].value = value;
    }

    getValue(): number
    {
        return this.joint_settings[this.joint_handle].value;
    }

    set current(value: any)
    {
        if (_.isString(value))
        {
            this.setValue(_.parseInt(value));
        }

        if (_.isNumber(value))
        {
            this.setValue(value);
        }
    }

    get current()
    {
        return this.getValue();
    }
}