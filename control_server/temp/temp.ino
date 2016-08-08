#include <EEPROM.h>
#include <JointController.h>

namespace { PLEN2::JointController joint_ctrl; }

void setup()
{
  joint_ctrl.loadSettings();
}


void loop()
{
  joint_ctrl.setAngleDiff(0, 300);
  delay(1000);
  joint_ctrl.setAngleDiff(0, (-300));
  delay(1000);

}