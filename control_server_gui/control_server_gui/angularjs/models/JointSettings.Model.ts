class JointSettingsModel
{
    controlling: number = 0;

    joint_settings = [
        {
            "name": "Left Shoulder Pitch",
            "_name": "left_shoulder_pitch",
            "value": 0
        },
        {
            "name": "Left Thigh Yaw",
            "_name": "left_thigh_yaw",
            "value": 0
        },
        {
            "name": "Left Shoulder Roll",
            "_name": "left_shoulder_roll",
            "value": 0
        },
        {
            "name": "Left Elbow Roll",
            "_name": "left_elbow_roll",
            "value": 0
        },
        {
            "name": "Left Thigh Roll",
            "_name": "left_thigh_roll",
            "value": 0
        },
        {
            "name": "Left Thigh Pitch",
            "_name": "left_thigh_pitch",
            "value": 0
        },
        {
            "name": "Left Knee Pitch",
            "_name": "left_knee_pitch",
            "value": 0
        },
        {
            "name": "Left Foot Pitch",
            "_name": "left_foot_pitch",
            "value": 0
        },
        {
            "name": "Left Foot Roll",
            "_name": "left_foot_roll",
            "value": 0
        },
        {
            "name": "Right Shoulder Pitch",
            "_name": "right_shoulder_pitch",
            "value": 0
        },
        {
            "name": "Right Thigh Yaw",
            "_name": "right_thigh_yaw",
            "value": 0
        },
        {
            "name": "Right Shoulder Roll",
            "_name": "right_shoulder_roll",
            "value": 0
        },
        {
            "name": "Right Elbow Roll",
            "_name": "right_elbow_roll",
            "value": 0
        },
        {
            "name": "Right Thigh Roll",
            "_name": "right_thigh_roll",
            "value": 0
        },
        {
            "name": "Right Thigh Pitch",
            "_name": "right_thigh_pitch",
            "value": 0
        },
        {
            "name": "Right Knee Pitch",
            "_name": "right_knee_pitch",
            "value": 0
        },
        {
            "name": "Right Foot Pitch",
            "_name": "right_foot_pitch",
            "value": 0
        },
        {
            "name": "Right Foot Roll",
            "_name": "right_foot_roll",
            "value": 0
        }
    ];

    static $inject = [
        // none
    ];

    constructor()
    {
        // noop.
    }

    setValue(value: number): void
    {
        this.joint_settings[this.controlling].value = value;
    }

    getValue(): number
    {
        return this.joint_settings[this.controlling].value;
    }

    getName(): string
    {
        return this.joint_settings[this.controlling].name;
    }
}